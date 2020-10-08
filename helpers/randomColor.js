const colors = ['blue', 'green', 'orange', 'black', 'yellow'];
const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = randomColor;