module.exports = {
    root:true,
    env: {
        node:true
    },
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debagger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    }
    
}