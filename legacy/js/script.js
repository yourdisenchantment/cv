"use strict"

document.addEventListener("DOMContentLoaded", function () {
    let jsonLdData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Павел Михеев",
        "jobTitle": "Frontend/Backend-разработчик",
        "url": "https://azzalie.github.io/cv/",
        "sameAs": [
            "https://t.me/azzalie",
            "https://github.com/azzalie",
        ],
    };

    let script = document.createElement('script');
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLdData);
    document.head.appendChild(script);
});

/**
 * Функция копирует текстовое содержимое указанного элемента.
 * @param {HTMLElement|string} element - HTML-элемент или селектор элемента.
 */
let copyTextFromElement = (element) => {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }

    if (!element) {
        console.error("Элемент для копирования не найден");
        return;
    }

    const textToCopy = element.innerText || element.textContent;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            console.log("Текст успешно скопирован:", textToCopy);
            element.classList.add('copied');
            setTimeout(() => {
                element.classList.remove('copied');
            }, 1500);
        })
        .catch((err) => {
            console.error("Ошибка при копировании текста: ", err);
        });
}
