export class SelectedGuildCache {
    static get() {
        return localStorage.getItem('selected_guild');
    }

    static set(value) {
        localStorage.setItem('selected_guild', value);
    }

    static remove() {
        localStorage.removeItem('selected_guild');
    }
}