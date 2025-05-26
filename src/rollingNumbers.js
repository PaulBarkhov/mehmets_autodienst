
class initRollingNumbers {

    constructor(el) {
        this.stat = el.querySelector('.rollingNumbers')
        this.currNum = 0

        if (this.stat.id === 'years') {
            this.targetNum = 1978
        }
        else {
            this.targetNum = Math.round(Date.now() / 200000000)
        }
    }

    scrollNumber(digits) {
        this.stat.querySelectorAll('span[data-value]').forEach((tick, i) => {
            tick.style.transform = `translateY(-${100 * parseInt(digits[i])}%)`;
        })
    }

    addDigit(digit, fresh) {
        const spanList = Array(10)
            .join(0)
            .split(0)
            .map((x, j) => `<span>${j}</span>`)
            .join('')

        this.stat.insertAdjacentHTML(
            "beforeend",
            `<span style="transform: translateY(-1000%)" data-value="${digit}">
            ${spanList}
        </span>`)

        const firstDigit = this.stat.lastElementChild

        setTimeout(() => {
            firstDigit.className = "visible";
        }, 0);
    }

    removeDigit() {
        const firstDigit = stat.lastElementChild
        firstDigit.classList.remove("visible");
        setTimeout(() => {
            firstDigit.remove();
        }, 1);
    }

    setup(startNum) {
        const digits = startNum.toString().split('')

        for (let i = 0; i < digits.length; i++) {
            this.addDigit('0', true)
        }

        this.scrollNumber(['0'])

        setTimeout(() => this.scrollNumber(digits), 100)
        this.currNum = startNum
    }

    rollToNumber(idx, num) {
        el.style.transform = `translateY(-${100 - num * 10}%)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const elements = document.querySelectorAll('.rollingNumbers-wrapper')
    const instances = []

    elements.forEach((el) => {
        instances.push(new initRollingNumbers(el))
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const instance = instances.find(item => item.stat === entry.target)
                instance.stat.querySelectorAll('span').forEach(item => item.remove())
                instance.setup(instance.targetNum)
            }
        });
    }, { threshold: 0 });

    instances.forEach((el) => {
        observer.observe(el.stat)
    });

})