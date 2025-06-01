class BMICalculator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    getEmoji(bmi) {
        if (bmi < 18.5) return '🍃';
        if (bmi < 24.9) return '😎';
        if (bmi < 29.9) return '🤔';
        return '⚠️';
    }

    getResult(bmi) {
        if (bmi < 18.5) {
            return {
                category: 'Underweight',
                advice: 'Your BMI is under standard. Try to eat more nutritious food and consult with a healthcare professional for healthy weight gain.',
                icon: 'warning',
                adviceColor: '#f59e42'
            };
        } else if (bmi < 24.9) {
            return {
                category: 'Normal weight',
                advice: 'Your BMI is in the standard range. Keep it up!',
                icon: 'success',
                adviceColor: '#22c55e'
            };
        } else if (bmi < 29.9) {
            return {
                category: 'Overweight',
                advice: 'Your BMI is over standard. Consider regular exercise and a balanced diet. Consult with a healthcare professional for healthy weight management.',
                icon: 'warning',
                adviceColor: '#f59e42'
            };
        } else {
            return {
                category: 'Obesity',
                advice: 'Your BMI is over standard. It is recommended to exercise regularly, eat healthy, and consult with a healthcare professional for guidance.',
                icon: 'error',
                adviceColor: '#ef4444'
            };
        }
    }

    calculateBMI(height, weight) {
        return weight / ((height / 100) ** 2);
    }

    calculateBMR(gender, weight, height, age) {
        // Mifflin-St Jeor Equation
        if (gender === 'male') {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    calculateCalorieNeeds(bmr, activityLevel = 1.55) {
        // Default: moderate activity
        return bmr * activityLevel;
    }

    showResult(bmi, bmr, calories, details) {
        const { category, advice, icon, adviceColor } = this.getResult(bmi);
        const emoji = this.getEmoji(bmi);
        Swal.fire({
            title: `${emoji} Your BMI is ${bmi.toFixed(1)}`,
            html: `<b>(${category})</b><br><span style='color:${adviceColor};font-weight:600;'>${advice}</span><hr>
                <div style='text-align:left;font-size:1rem;'>
                    <b>BMR:</b> ${bmr.toFixed(0)} kcal/day<br>
                    <b>Estimated Calorie Needs:</b> ${calories.toFixed(0)} kcal/day<br>
                    <b>Age:</b> ${details.age} years<br>
                    <b>Gender:</b> ${details.gender.charAt(0).toUpperCase() + details.gender.slice(1)}<br>
                    <b>Height:</b> ${details.height} cm<br>
                    <b>Weight:</b> ${details.weight} kg
                </div>`,
            icon: icon,
            confirmButtonText: 'OK',
            customClass: {
                title: 'fs-3',
                htmlContainer: 'fs-5'
            }
        });
    }

    showError() {
        Swal.fire({
            title: 'Invalid input',
            text: 'Please enter valid age, gender, height and weight.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const age = parseInt(document.getElementById('age').value);
        const gender = (document.querySelector('input[name="gender"]:checked') || {}).value;
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        if (age > 0 && (gender === 'male' || gender === 'female') && height > 0 && weight > 0) {
            const bmi = this.calculateBMI(height, weight);
            const bmr = this.calculateBMR(gender, weight, height, age);
            const calories = this.calculateCalorieNeeds(bmr);
            this.showResult(bmi, bmr, calories, { age, gender, height, weight });
        } else {
            this.showError();
        }
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new BMICalculator('bmiForm');
});
