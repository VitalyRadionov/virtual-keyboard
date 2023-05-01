// const this.textField = document.querySelector('textarea');

export default {
  step: 0,
  textField: () => document.querySelector('textarea'),
  value: () => document.querySelector('textarea').value,
  setStep() {
    let lineStart = this.value().lastIndexOf('\n', this.textField().selectionStart);

    if (this.textField().selectionStart && lineStart > -1) {
      if (lineStart === this.textField().selectionStart) {
        lineStart = this.value().lastIndexOf('\n', this.textField().selectionStart - 1) + 1;
        this.step = this.textField().selectionStart - lineStart;
        return this.step;
      }
      this.step = this.textField().selectionStart - lineStart - 1;
      return this.step;
    }

    lineStart = 0;
    this.step = this.textField().selectionStart - lineStart;
    return this.step;
  },
  ArrowUp(selectionStart) {
    if (selectionStart) {
      const lineEnd = this.value().lastIndexOf('\n', selectionStart - 1);
      const lineStart = this.value().lastIndexOf('\n', ((lineEnd <= -1) || lineEnd) - 1) + 1;
      const position = lineEnd > -1 ? (lineStart + this.step) : 0;

      if ((position > lineEnd) && (lineEnd > -1)) {
        this.textField().setSelectionRange(lineEnd, lineEnd);
        return;
      }
      this.textField().setSelectionRange(position, position);
      return;
    }
    this.textField().setSelectionRange(selectionStart, selectionStart);
  },
  ArrowDown(selectionStart) {
    const lineStart = this.value().indexOf('\n', selectionStart);
    let lineEnd = this.value().indexOf('\n', lineStart > -1 ? (lineStart + 1) : this.value().length);
    let position = 0;

    if (lineEnd < 0) {
      lineEnd = this.value().length;
    }

    if (lineStart > -1) {
      if (this.value()[selectionStart] === '\n') {
        position = (lineStart + this.step) >= lineEnd ? lineEnd : (lineStart + this.step + 1);
        return this.textField().setSelectionRange(position, position);
      }
      position = (lineStart + this.step) >= lineEnd ? lineEnd : (lineStart + this.step + 1);
      return this.textField().setSelectionRange(position, position);
    }

    return this.textField().setSelectionRange(this.value().length, this.value().length);
  },
  ArrowRight(start) {
    const position = start < this.value().length ? start + 1 : this.value().length;
    this.textField().setSelectionRange(position, position);
    return this.setStep();
  },
  ArrowLeft(start) {
    const position = start ? start - 1 : 0;
    this.textField().setSelectionRange(position, position);
    return this.setStep();
  },
};
