const error = (msg: string): void => {
    return console.error('Svelte-Router [Error]: ' + msg);
};
const warn = (msg: string): void => {
    return console.warn('Svelte-Router [Warn]: ' + msg);
};

const validateParams = (path: string, params: Record<string, string>): boolean => {
    let valid = true;

    // Validate required params
    path.split('/:').forEach((param, i) => {
        if (i === 0) return;

        if (!params || !params[param]) {
            valid = false;
            error('Missing required param: "' + param + '"');
        }
    });

    return valid;
};

export { error, warn, validateParams };
