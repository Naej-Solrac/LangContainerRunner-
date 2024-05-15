

require('@babel/polyfill');
require('@babel/register')({ presets: ['@babel/preset-env'] });

require('./app');
const app = require('./app')


app.listen(app.get('port')), () => {
    console.log('server port:', app.get('port'));

}