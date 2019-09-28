export const switchLanguageActions = {
    setLanguage
};

function setLanguage(language) {
    return { type: "SET_LANGUAGE", language };
}
