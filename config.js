module.exports = {
    PORT: process.env.PORT || 5000,
    Database: 'collections-site',
    User_db: 'slamser56',
    Password_db: 'Q17kasd99kj32',
    Host_db: 'rm-4xo72w2vm2s936687fo.mysql.germany.rds.aliyuncs.com',
    SESSION_SECRET: 'SDASND897dsa98d7sa98DHBDAHS78dsahj789S',
    SESSION_LIFETIME: 1000 * 60 * 60 * 2,
    GOOGLE_clientID: '354883008579-45gkljdpp4ppu3c657lta090t046dvk8.apps.googleusercontent.com',
    GOOOGLE_clientSecret: '44oSjbK275mr9Nz7q3w_9_yQ',
    GITHUB_CLIENT_ID: process.env.NODE_ENV === 'production' ? '175afe5760fbc8f13129' : '9098dfc4e35a3525f186',
    GITHUB_CLIENT_SECRET: process.env.NODE_ENV === 'production' ? '02adc47c0c8171179b5ef11d1ba558de00f2c5d1' : 'e87cae63ddbbf9dc35dfb2868020fc623d403770'
}