# is-institutional-email
A module that checks whether an email address is institutional. This is a fork of the `swot-js` package, which would return false if not all domains were loaded yet. Because the package had not Github repo where I could make a pull request, I decided to publish it again. The API is also simplified:


````javascript
let isInstitutionalEmail = require('is-institutional-email');
isInstitutionalEmail('something@stanford.edu') // true
isInstitutionalEmail('something@something.stanford.edu') // false
isInstitutionalEmail('something@something.stanford.edu', true) // true (accept subdomain)
````