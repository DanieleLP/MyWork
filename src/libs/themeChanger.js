const themeChanger = (className) => {
    let themes = ["default", "yellow", "lightblue", "purple", "petrol"]
    themes.forEach((theme) => {
        if (className.includes(theme)) {
            themes.forEach((iTheme) => {
                if (iTheme === theme) {
                    document.body.classList.add(theme)
                    return theme;
                } else {
                    document.body.classList.remove(iTheme);
                }
            })
        }
    })
}

export {
    themeChanger
}