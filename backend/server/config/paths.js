const os = require('os');
const path = require('path');

// Get the user's home directory dynamically
const userHomeDir = os.homedir();

// Point to a folder on the user's Desktop
const desktopImagesDir = path.join(userHomeDir, 'Desktop', 'testing');

module.exports = {
  desktopImagesDir,
};
