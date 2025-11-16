#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const LOGO_REQUIREMENTS = {
  minSize: 64,
  recommendedSize: 200,
  maxFileSize: 500 * 1024, // 500KB
  allowedFormats: ['png', 'svg'],
};

async function validateLogo(filePath) {
  const fileName = path.basename(filePath);
  const fileExtension = path.extname(fileName).toLowerCase().slice(1);

  // Check file format
  if (!LOGO_REQUIREMENTS.allowedFormats.includes(fileExtension)) {
    throw new Error(`Invalid format: ${fileExtension}. Allowed: ${LOGO_REQUIREMENTS.allowedFormats.join(', ')}`);
  }

  // Check file size
  const stats = fs.statSync(filePath);
  if (stats.size > LOGO_REQUIREMENTS.maxFileSize) {
    throw new Error(`File size ${stats.size} bytes exceeds maximum ${LOGO_REQUIREMENTS.maxFileSize} bytes`);
  }

  // Skip image dimension checks for SVG
  if (fileExtension === 'svg') {
    console.log(`✓ ${filePath}: SVG format (skipping dimension check)`);
    return;
  }

  // Check PNG dimensions
  try {
    const metadata = await sharp(filePath).metadata();
    const { width, height } = metadata;

    if (width < LOGO_REQUIREMENTS.minSize || height < LOGO_REQUIREMENTS.minSize) {
      throw new Error(`Image size ${width}x${height}px is below minimum ${LOGO_REQUIREMENTS.minSize}x${LOGO_REQUIREMENTS.minSize}px`);
    }

    if (width !== height) {
      console.warn(`⚠ ${filePath}: Image is not square (${width}x${height}px)`);
    }

    if (width < LOGO_REQUIREMENTS.recommendedSize || height < LOGO_REQUIREMENTS.recommendedSize) {
      console.warn(`⚠ ${filePath}: Size ${width}x${height}px below recommended ${LOGO_REQUIREMENTS.recommendedSize}x${LOGO_REQUIREMENTS.recommendedSize}px`);
    }

    console.log(`✓ ${filePath}: ${width}x${height}px, ${(stats.size / 1024).toFixed(2)}KB`);
  } catch (error) {
    throw new Error(`Failed to read PNG metadata: ${error.message}`);
  }
}

async function findAndValidateLogos() {
  const logoPaths = [
    'evm-usd.png',
    'blockchains/**/assets/**/logo.png',
    'blockchains/**/assets/**/logo.svg',
  ];

  const logos = [];
  
  // Check explicit path first
  if (fs.existsSync('evm-usd.png')) {
    logos.push('evm-usd.png');
  }

  // Find logos in blockchains directory
  if (fs.existsSync('blockchains')) {
    const findLogos = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          findLogos(fullPath);
        } else if (['logo.png', 'logo.svg'].includes(file)) {
          logos.push(fullPath);
        }
      });
    };
    findLogos('blockchains');
  }

  if (logos.length === 0) {
    console.log('No logos found to validate');
    return;
  }

  console.log(`\n🔍 Validating ${logos.length} logo(s)...\n`);

  const results = {
    valid: [],
    warnings: [],
    errors: [],
  };

  for (const logo of logos) {
    try {
      await validateLogo(logo);
      results.valid.push(logo);
    } catch (error) {
      results.errors.push({ file: logo, error: error.message });
    }
  }

  console.log(`\n✅ Valid: ${results.valid.length}`);
  if (results.warnings.length > 0) {
    console.log(`⚠️ Warnings: ${results.warnings.length}`);
  }
  if (results.errors.length > 0) {
    console.log(`❌ Errors: ${results.errors.length}`);
    results.errors.forEach(({ file, error }) => {
      console.error(`  ${file}: ${error}`);
    });
    process.exit(1);
  }

  fs.writeFileSync('validation-results.json', JSON.stringify(results, null, 2));
  console.log('\nValidation passed! ✨\n');
}

findAndValidateLogos().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
});
