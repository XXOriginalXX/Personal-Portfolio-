
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});


const backToTopButton = document.createElement('button');
backToTopButton.innerText = '↑ Top';
backToTopButton.id = 'back-to-top';
document.body.appendChild(backToTopButton);

backToTopButton.style.display = 'none'; 


window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});


backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


const darkModeToggle = document.createElement('button');
darkModeToggle.innerText = 'Toggle Dark Mode';
darkModeToggle.id = 'dark-mode-toggle';
document.body.appendChild(darkModeToggle);


darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
document.getElementById('prediction-form').addEventListener('submit', async (event) => {
    event.preventDefault(); 


    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;

  
    const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: [input1, input2] }),
    });


    const result = await response.json();
    document.getElementById('result').innerText = `Prediction: ${result.prediction}`;
});
document.addEventListener('DOMContentLoaded', () => {

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
    handleScroll(); 


    document.getElementById('prediction-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const input1 = document.getElementById('input1').value;
        const input2 = document.getElementById('input2').value;

        const loading = document.getElementById('loading');
        const result = document.getElementById('result');

        loading.style.display = 'block';
        result.innerText = '';

        try {
            const response = await fetch('https://adanipredictionapp.onrender.com', {
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
