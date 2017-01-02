// load sound
const sound = {
  bigbox: new Audio('./sound/bigbox.mp3'),
  smallbox: new Audio('./sound/smallbox.mp3'),
  messagebox: new Audio('./sound/messagebox.mp3')
};

export function playBigBox() {
  sound.bigbox.play();
}

export function playSmallBox() {
  sound.smallbox.play();
}

export function playMessageBox() {
  sound.messagebox.play();
}