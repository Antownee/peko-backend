export function languageSwitch(state = {}, action) {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { currentLanguage: action.language };
    default:
      return state
  }
}