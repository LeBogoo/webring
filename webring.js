document.addEventListener("DOMContentLoaded", async function () {
    const webringContainer = document.getElementById("webring");
    if (!webringContainer) {
        console.warn("Webring container not found. Please ensure there is an element with id 'webring' in your HTML.");
        return
    }

    const infoContainer = document.createElement("div");
    infoContainer.textContent = "This site is part of the Cosmic Webring. Use the links below to navigate to other sites in the ring!";
    webringContainer.appendChild(infoContainer);
    const linksContainer = document.createElement("div");
    webringContainer.appendChild(linksContainer);

    const { prev, next, random } = await fetchLinks();
    createLinks(linksContainer, prev, next, random);
});

async function fetchLinks() {
    const response = await fetch("https://raw.githubusercontent.com/LeBogoo/webring/refs/heads/main/ring.json");
    if (!response.ok) {
        throw new Error(`Failed to load ring.json: ${response.statusText}`);
    }
    const webringLinks = await response.json();
    const currentUrl = window.location.href;
    const currentHostname = new URL(currentUrl).hostname;
    const currentIndex = webringLinks.findIndex(link => {
        try {
            return new URL(link).hostname === currentHostname;
        } catch {
            return false;
        }
    });
    if (currentIndex === -1) {
        console.warn("Current hostname not found in webring links. Please ensure your site is included in webring.json.");
        return;
    }

    const prevIndex = (currentIndex - 1 + webringLinks.length) % webringLinks.length;
    const nextIndex = (currentIndex + 1) % webringLinks.length;
    const prev = webringLinks[prevIndex];
    const next = webringLinks[nextIndex];

    let random = undefined;
    if (webringLinks.length > 3) {
        do {
            let randomIndex = Math.floor(Math.random() * webringLinks.length);
            random = webringLinks[randomIndex];
        }
        while (random === currentUrl || random === prev || random === next)
    }

    return { prev, next, random };
}

function createLinks(container, prev, next, random) {

    const prevAnchor = document.createElement("a");
    prevAnchor.href = prev;
    prevAnchor.textContent = "Previous";
    container.appendChild(prevAnchor);




    if (random) {
        const randomAnchor = document.createElement("a");
        randomAnchor.href = random;
        randomAnchor.textContent = "Random";
        container.appendChild(randomAnchor);

    }

    const nextAnchor = document.createElement("a");
    nextAnchor.href = next;
    nextAnchor.textContent = "Next";
    container.appendChild(nextAnchor);
}