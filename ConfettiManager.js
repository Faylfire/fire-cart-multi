import JSConfetti from "js-confetti";

export default class ConfettiManager {
  constructor() {
    this.timeout = null;
    this.jsConfetti = new JSConfetti();
  }

  trigger() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.jsConfetti.addConfetti({
        emojis: [
          "🌈",
          "⚡️",
          "💥",
          "✨",
          "💫",
          "🌸",
          "🦄",
          "😄",
          "😁",
          "😆",
          "😅",
          "😂",
          "🤣",
          "😍",
          "🥰",
          "😘",
        ],
        confettiNumber: 300,
        emojiSize: 15,
      });

      this.jsConfetti.addConfetti({
        confettiNumber: 300,
      });

      this.timeout = null;
    }, 300);
  }
}
