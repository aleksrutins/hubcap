# hubcap
## A package manager for GitHub repositories
### Installation
```sh
$ npm install -g @munchkinhalfling/hubcap
```
### Usage
To install a repository, run `sudo hubcap install <org>/<repo>`. For example, to install Bettermake, use `sudo hubcap install munchkinhalfling/bettermake`. \
Hubcap installs each program in its own prefix and then symlinks the binaries. Therefore, uninstallation is as easy as `rm -rf`'ing `/usr/local/hubcap/install/<user>/<repo>`. \

### Adding hubcap to your repository
Create a file called `.hubcap/config.yml` in your repository on the `master` branch. See [the one in Bettermake](https://github.com/munchkinhalfling/bettermake/blob/master/.hubcap/config.yml) for an example and syntax. \
Then, people can install your repo as detailed above. There is no central package submission database or anything, so that is all that is needed.