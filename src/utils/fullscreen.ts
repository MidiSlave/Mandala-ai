export function getFullscreenElement(): Element | null {
    return document.fullscreenElement
        || (document as any).webkitFullscreenElement
        || null;
}

export function requestFullscreen(el: HTMLElement): Promise<void> {
    if (el.requestFullscreen) return el.requestFullscreen();
    if ((el as any).webkitRequestFullscreen) return (el as any).webkitRequestFullscreen();
    return Promise.reject(new Error('Fullscreen API not supported'));
}

export function exitFullscreen(): Promise<void> {
    if (document.exitFullscreen) return document.exitFullscreen();
    if ((document as any).webkitExitFullscreen) return (document as any).webkitExitFullscreen();
    return Promise.reject(new Error('Fullscreen API not supported'));
}
