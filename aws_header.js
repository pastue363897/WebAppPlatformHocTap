const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXM7JK7QTY7TQ3VEG',
    secredtAccessKey: 'MYZ6r40E6yd6RILzqSYmL+KW0AntWjAYQNFnIZ5f',
    sessionToken: 'FQoGZXIvYXdzEDgaDCAKu2EEcajC3tYgGiKFApBWscyrTPmMPpuMumyR/ToTlxB6Ey/YvCRsmYInf5TFUSP2sIPWZUIQbpaYirVzDn2usoF7sI/roJ1xMPblgkF6PYVUaZUhWl1BsaI4w5ZByc4u4nfGpVHWlK1bQuWkFajR7j0oWxN3UgtRvQY9/uJCePqzjQ33vJPK3KeaeBpQF6Q0eVn5gzOX7Y4HaHv7ryYhl/Ws5aE07aYoG9rlkPWQxcPG17XhO3fb+cS3J2cXKgbIGL7IrFK5YmIYpNZ41/I1lN9GfJeN0Feelzk9XPT2lmu/VWZ09ZW5kwX+mSOH9kMttAcETxdgMh9wm9xFUizhymTWbz5JXDMVRjdPS7JugKftIyio48btBQ=='
});

module.exports = {
    AWS: AWS
}