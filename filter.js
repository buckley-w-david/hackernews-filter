browser.storage.local.get().then(async settings => {
    console.log("Starting HN-Filter!")
    if (!settings.regex) {
        console.log("No HN filter regex defined, exiting!")
        return
    }

    const selector = settings.selector || ".athing > .title:last-child > a"
    const regex = new RegExp(settings.regex, 'i')

    const filter = async () => {
        const posts = Array.from(document.querySelectorAll(selector))
        const hide = posts.filter(node => node.innerText.match(regex))
        for (const title of hide) {
            console.log("Hiding", title.innerText)
            const post = title.parentElement.parentElement
            post.nextSibling.querySelector(".clicky").click()
            // Wait 2 seconds, HN is pretty aggressive about rate limiting these calls
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // Callback function to execute when mutations are observed
    const callback = async (mutationsList, observer) => {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('A child node has been added or removed.');
                await filter()
            }
        }
    };

    const targetNode = document.querySelector(".itemlist")
    const config = { childList: true }
    
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Run initial filter
    // We'll pick up on our own mutations, but hopefully that shouldn't break things...
    await filter()
})
