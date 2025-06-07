const clickBox = document.getElementById('clickBox');
const hiddenContent = document.getElementById('hiddenContent');
const loveWord = document.getElementById('loveWord');
const romanticDesign = document.getElementById('romanticDesign');
const nextBtn = document.getElementById('nextBtn');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

const loveFeelings = [
  "Hello Hazel.",
  "Kamusta ka, Hazel?",
  "Hazel, ikaw ang dahilan kung bakit ako narito.",
  "Sa bawat tibok ng puso ko Hazel, pangalan mo ang sigaw.",
  "Hindi ko man masabi nang perpekto, pero ikaw ang tula sa bawat katahimikan ko Hazel."
];

let currentIndex = 0;

function animateLoveWord(text) {
  loveWord.style.opacity = 0;
  loveWord.style.transform = "translateY(20px)";
  loveWord.textContent = `"${text}"`;

  // Force reflow to restart transition
  void loveWord.offsetWidth;

  loveWord.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  loveWord.style.opacity = 1;
  loveWord.style.transform = "translateY(0)";
}

function showNextFeeling() {
  const feeling = loveFeelings[currentIndex];
  animateLoveWord(feeling);
  currentIndex = (currentIndex + 1) % loveFeelings.length;
}

clickBox.addEventListener('click', () => {
  clickBox.style.display = 'none';
  hiddenContent.classList.add('visible');
  nextBtn.classList.add('next-visible');
  showNextFeeling();
  startFireworks();
});

nextBtn.addEventListener('click', showNextFeeling);

// Fireworks animation setup
let cw, ch;
let fireworks = [];
let particles = [];

function resize() {
  cw = window.innerWidth;
  ch = window.innerHeight;
  canvas.width = cw;
  canvas.height = ch;
}

window.addEventListener('resize', resize);
resize();

class Firework {
  constructor() {
    this.x = Math.random() * cw;
    this.y = ch;
    this.targetY = Math.random() * ch * 0.5 + ch * 0.2;
    this.speed = 3 + Math.random() * 3;
    this.isExploded = false;
    this.color = `rgba(255, 105, 180, 1)`; // pinkish
  }

  update() {
    if (!this.isExploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.isExploded = true;
        this.explode();
      }
    }
  }

  explode() {
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle(this.x, this.y));
    }
  }

  draw() {
    if (!this.isExploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 3 + Math.random() * 2;
    this.color = `rgba(255, 182, 193, ${Math.random()})`; // light pink transparent
    this.speedX = (Math.random() - 0.5) * 6;
    this.speedY = (Math.random() - 0.5) * 6;
    this.gravity = 0.05;
    this.alpha = 1;
    this.decay = 0.02 + Math.random() * 0.02;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    // Draw a simple petal shape (ellipse)
    ctx.ellipse(this.x, this.y, this.radius, this.radius * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function startFireworks() {
  fireworks = [];
  particles = [];

  setInterval(() => {
    fireworks.push(new Firework());
  }, 500);

  function animate() {
    ctx.clearRect(0, 0, cw, ch);

    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      if (fireworks[i].isExploded) {
        fireworks.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
