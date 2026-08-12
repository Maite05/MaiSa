import { useSettingsUiStore } from "../store";

export const useSettingsActions = () => useSettingsUiStore((s) => ({ markSaved: s.markSaved, reset: s.reset }));
