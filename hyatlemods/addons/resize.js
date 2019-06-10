const sharp = require('sharp');
const uuidv4 = require('uuid/v4');
const path = require('path');

class Resize {
  constructor(folder, x, y) {
    this.folder = folder;
    this.x = x;
    this.y = y
  }
  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(this.x, this.y, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);
    
    return filename;
  }
  static filename() {
    return `${uuidv4()}.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}
module.exports = Resize;