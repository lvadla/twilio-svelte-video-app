import { readable, writable } from 'svelte/store';

export const time = readable(null, function start(set) {
    const interval = setInterval(() => {
        set(new Date());
    }, 1000);

    return function stop() {
        clearInterval(interval);
    };
});

export const token = writable('');

export const roomName = writable('');

export const userName = writable('');