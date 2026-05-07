const form = document.querySelector("#news-form");
const styleInput = document.querySelector("#style");
const headlineInput = document.querySelector("#headline");
const imageInput = document.querySelector("#image");
const canvas = document.querySelector("#news-canvas");
const download = document.querySelector("#download");
const ctx = canvas.getContext("2d");
let uploadedImage = null;

function loadImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

function drawCoverImage(image) {
  if (!image) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#242424");
    gradient.addColorStop(0.5, "#080808");
    gradient.addColorStop(1, "#17180e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;
  ctx.drawImage(image, x, y, width, height);
}

function drawOverlay() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.08)");
  gradient.addColorStop(0.46, "rgba(0, 0, 0, 0.1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.72)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function wrapText(text, maxWidth, font) {
  ctx.font = font;
  const words = text.trim().split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;

    if (ctx.measureText(testLine).width <= maxWidth) {
      line = testLine;
      return;
    }

    if (line) {
      lines.push(line);
    }

    line = word;
  });

  if (line) {
    lines.push(line);
  }

  return lines;
}

function drawUnofficialMark() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  ctx.font = "820 46px Inter, Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("jakublabs.xyz", 1528, 76);
  ctx.textAlign = "left";
}

function drawBbcStyle(headline) {
  ctx.fillStyle = "#b80000";
  ctx.fillRect(0, 690, canvas.width, 132);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 822, canvas.width, 78);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 46px Inter, Arial, sans-serif";
  ctx.fillText("BREAKING NEWS", 70, 774);

  ctx.fillStyle = "#111111";
  const font = "850 52px Inter, Arial, sans-serif";
  const lines = wrapText(headline, 1380, font).slice(0, 1);
  ctx.font = font;
  ctx.fillText(lines[0] || headline, 70, 876);

}

function drawSkyStyle(headline) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(70, 612, 330, 92);
  ctx.fillStyle = "#d40000";
  ctx.fillRect(400, 612, 420, 92);

  ctx.fillStyle = "#111111";
  ctx.font = "900 45px Inter, Arial, sans-serif";
  ctx.fillText("BREAKING", 100, 673);

  ctx.fillStyle = "#ffffff";
  ctx.fillText("NEWS", 430, 673);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(70, 704, 1240, 126);

  ctx.fillStyle = "#111111";
  const font = "850 54px Inter, Arial, sans-serif";
  const lines = wrapText(headline, 1140, font).slice(0, 1);
  ctx.font = font;
  ctx.fillText(lines[0] || headline, 106, 784);

  ctx.fillStyle = "#d40000";
  ctx.fillRect(70, 830, 1240, 12);
}

function generateGraphic() {
  const headline = headlineInput.value || "BREAKING NEWS GOES HERE";

  drawCoverImage(uploadedImage);
  drawOverlay();

  if (styleInput.value === "sky") {
    drawSkyStyle(headline);
  } else {
    drawBbcStyle(headline);
  }

  drawUnofficialMark();
  download.href = canvas.toDataURL("image/png");
}

imageInput.addEventListener("change", async () => {
  const [file] = imageInput.files;
  uploadedImage = file ? await loadImage(file) : null;
  generateGraphic();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateGraphic();
});

styleInput.addEventListener("change", generateGraphic);
headlineInput.addEventListener("input", generateGraphic);

generateGraphic();
