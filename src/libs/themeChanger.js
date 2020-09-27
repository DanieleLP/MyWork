const themeChanger = (className) => {
    let themes = ["default", "yellow", "green", "blue", "petrol", "smokeblue"]
    let selectedTheme = ""
    themes.forEach((theme) => {
        if (className.includes(theme)) {
            themes.forEach((iTheme) => {
                if (iTheme === theme) {
                    document.body.classList.add(theme)
                    selectedTheme = theme;
                } else {
                    document.body.classList.remove(iTheme);
                }
            })
        }
    })

    return selectedTheme;
}

export {
    themeChanger
}