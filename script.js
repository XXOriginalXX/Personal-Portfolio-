// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});

// Back to Top button functionality
const backToTopButton = document.createElement('button');
backToTopButton.innerText = '↑ Top';
backToTopButton.id = 'back-to-top';
document.body.appendChild(backToTopButton);

backToTopButton.style.display = 'none'; // Initially hidden

// Show/hide the button on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// Scroll to the top on button click
backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark mode toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.innerText = 'Toggle Dark Mode';
darkModeToggle.id = 'dark-mode-toggle';
document.body.appendChild(darkModeToggle);

// Toggle dark mode styles
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
document.getElementById('prediction-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop the page from refreshing

    // Get the data entered by the user
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;

    // Send the data to your Python program
    const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: [input1, input2] }),
    });

    // Get the prediction back and show it
    const result = await response.json();
    document.getElementById('result').innerText = `Prediction: ${result.prediction}`;
});
document.addEventListener('DOMContentLoaded', () => {
    // Scroll-triggered animations for sections
    const sections = document.querySelectorAll('section.hidden');

    const handleScroll = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on page load

    // Form submission and prediction
    document.getElementById('prediction-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const input1 = document.getElementById('input1').value;
        const input2 = document.getElementById('input2').value;

        const loading = document.getElementById('loading');
        const result = document.getElementById('result');

        loading.style.display = 'block';
        result.innerText = '';

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: [input1, input2] }),
            });

            const data = await response.json();
            result.innerText = `Prediction: ${data.prediction}`;
        } catch (error) {
            result.innerText = 'Error fetching prediction!';
        } finally {
            loading.style.display = 'none';
        }
    });
});
