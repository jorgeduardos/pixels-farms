all: init template webpack-mix

init: installcraft
	@rm -rf .git
	@rm -rf cms/.gitignore
	@cp -r cms/ .
	@rm -rf cms
	@sleep 2
	@echo "Installing required CraftCMS 3 Plugins..."
	composer require nystudio107/craft-minify
	@sleep 1 
	php craft plugin/install minify
	@sleep 1
	composer require misterbk/mix
	@sleep 1
	php craft plugin/install mix
	@sleep 1
	composer require craftcms/redactor
	@sleep 1
	php craft plugin/install redactor
	@sleep .5
	composer require ether/seo
	@sleep 1
	@php craft plugin/install seo
	@sleep 1
	@git clone https://gist.github.com/11156bbd6bac5064d3d7109ebcb2763d.git ./config/mix
	@mv -f ./config/mix/mix.php ./config
	@rm  -rf ./config/mix
	@sleep 1
	@git clone https://github.com/anuarhdz/default-redactor-config.git ./config/redactor/redactor-default
	@mv -f ./config/redactor/Default.json ./config/redactor/OldDefault.json
	@rm -rf ./config/redactor/redactor-default/.git
	@rm -rf ./config/redactor/redactor-default/.gitignore
	@cp -r ./config/redactor/redactor-default/ ./config/redactor/
	@rm -rf ./config/redactor/redactor-default
	@echo "Redactor default config done"
	@sleep .5
	@echo "CraftCMS ready!"

installcraft:
	@echo "Installing CraftCMS 3..." && \
	composer create-project craftcms/craft cms 
	@sleep 5

template: codebase
	@echo "Downloading boilerplate..."
	@rm -rf templates
	@git clone https://github.com/anuarhdz/craftcms-template.git ./templates
	@rm -rf templates/.git
	@echo "Boilerplate ready!"

codebase:
	@echo "Downloading code base..."
	@git clone https://github.com/anuarhdz/codebase.git ./src
	@rm -rf src/.git
	@echo "Codebase ready!"

webpack-ssl: webpackfile-ssl getnpmfiles
	@echo "Setup Laravel Mix and Webpack..."
	npm install
	@echo "Laravel Mix and webpack ready!"

webpackfile-ssl: 
	@echo "Setup webpack with support to vhost with SSL"
	@git clone https://gist.github.com/111e54dc247ec205c081e7f724dc0187.git ./webpack
	@mv -f webpack/webpack.mix.js .
	@rm  -rf webpack
	@echo "Webpack SSL Done!"

webpack: webpackfile-nossl getnpmfiles
	@echo "Setup Laravel Mix and Webpack..."
	npm install
	@echo "Laravel Mix and webpack ready!"

webpackfile-nossl:
	@echo "Setup webpack..."
	@git clone https://gist.github.com/eabb0977bdb4fb6c6ba0bf8a67496d69.git ./webpack
	@mv -f webpack/webpack.mix.js .
	@rm  -rf webpack
	@echo "Webpack Done!"

getnpmfiles: 
	@echo "Babel setup..."
	@git clone https://gist.github.com/081e7045cab50624991c26c3e4e36542.git ./babel
	@mv -n babel/.babelrc .
	@rm  -rf babel
	@echo "Babel done!"
	@echo "Package setup..."
	@git clone https://gist.github.com/f640d923926556d740d94ad138d83345.git ./npm
	@mv -n npm/package.json .
	@rm  -rf npm
	@echo "Package done!"
	@sleep .5

staging:
	npm run dev

work: criticalclean
	@echo "Modo sync o watch activo..."
	npm run sync

prod:		
	npm run prod

criticalclean:
	@rm -rf templates/_critical/*min.css

setupnpm:
	npm install

webpack-mix: getMix getPackageFiles 
	@echo "Setup Laravel Mix and Webpack..."
	npm install
	@echo "Laravel Mix and webpack ready!"

getMix:
	@echo "Setup webpack..."
	@git clone https://gist.github.com/975daa4cc5ff4fcaec8420200308f954.git ./webpack
	@mv -f webpack/webpack.mix.js .
	@rm  -rf webpack
	@echo "Webpack Done!"

getPackageFiles:
	@echo "Babel setup..."
	@git clone https://gist.github.com/081e7045cab50624991c26c3e4e36542.git ./babel
	@mv -n babel/.babelrc .
	@rm  -rf babel
	@echo "Babel done!"
	@echo "Package setup..."
	@git clone https://gist.github.com/44e7f92990bab8cc0dd4d02e6c5e2109.git ./npm
	@mv -n npm/package.json .
	@rm  -rf npm
	@echo "Package done!"
	@sleep .5

mix-dev: 
	npx mix watch

mix-staging:
	npx mix

mix-prod:
	npx mix -p