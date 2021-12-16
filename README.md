# Overview of CICD Plan
The idea was to develop and test a MIT licensed multipage Bootstrap/JavaScript template repository so that it could be easily replicated and deployed for future website development. Any changes to the website should automatically trigger a test before it is merged into the project. 



![Optional Text](../main/screenshots/diagram.png)



# GitHub Demo
The website can be viewed at https://gurby123.github.io/AppBootStrap/
The images on this website are not free and are only for demo purposes. 

# WorkFlow
The website was retrieved from a Themefisher demo with an MIT license. The workflow file was added to monitor and test it before deployment. It was tested on Node.js 12.x, 14.x and 16.x. So far the tests on 14.x and 16.x have failed. I am able to successfully integrate github-actions with the local machine using Node.js 12.x. The push function to the VPS server and Docker Hub is still work in progress.

#Google Cloud

Start by trying to use gcr.io as suggested by the professor's node.api demo but soon realized that registry and artifacts hosting is only possible for paid account. So decided to use my own server.

# Docker1 

The Docker file with ALPINE and python broke the images and hyperlinks of the website giving a skeletal website witohut the bells and whistles of CSS and SASS. 

Dockerfile code was as follows:
```
FROM alpine
EXPOSE 8080
RUN apk update
RUN apk add python2
COPY index.html /tmp/index.html
COPY start.sh /tmp/start.sh
USER 1000
CMD ["sh","/tmp/start.sh"]
```
start.sh was as follows: 
```
cd /tmp
mkdir www
cp index.html www
echo "<hr>Running on $(hostname)" >> www/index.html
cd www
python -m SimpleHTTPServer 8080
```
Docker Build command was as follows:
```
docker build . -t  appbootstrap
```
Docker run command was as follows:
```
docker run -d -p 8080:8080 appbootstrap
```
# Docker2
Still install python to display index.html but also installed node.js, npm and gulp. There was no inprovement with navigating hyperlinks, images and CSS

The Dockerfile code is as follows:
```
FROM mhart/alpine-node:latest

RUN apk update
RUN apk add python2	

WORKDIR /usr/src/app
RUN apk add --update nodejs nodejs-npm
COPY package*.json ./
RUN  npm install

RUN npm install -g gulp

COPY index.html /tmp/index.html
COPY start.sh /tmp/start.sh
USER 1000
CMD ["sh","/tmp/start.sh"]
```
Docker build command:
```
docker build . -t  appbootstrap3
```
Docker run command:
```
docker run -d -p 8080:8080 appbootstrap3
```
# Docker3
Docker3 finally worked in displaying the webiste with nginx from alpine. It is working because of the bootstrap code while advance users will need to figure out the depedencies and setting to use nodejs and gulp on this website template. However Nodejs 12.x passed the installtion while 14.x and 16.x failed

Dockerfile is as follows:
```
FROM nginx:alpine
## Copy a new configuration file setting listen port to 8080
COPY ./default.conf /etc/nginx/conf.d/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

default.conf is as follows:

```server {
    listen       8080;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```
Docker build command:
```
docker build . -t  appbootstrap
```
Docker run command:
```
docker run -d -p 8080:8080 appbootstrap
```
Command to check port usage:
```
lsof -n -i4TCP:8080
```
Comand to kill port usage
```
kill -9 10653 (where 10653 is the pid from earlier occupying 8080)
```

# DockerHub
While I was able to work ith Docker Desktop locally and up load the builds, this was not possible with the free online Docker Hub Account. They have added a requirment of tagnmes and where apparently, automatic processing through github may be only provided with Docker Pro account. So while local images are build and run, the Docker Hub account was not able to get the latest build. I followed steps from: (https://blog.bitsrc.io/https-medium-com-adhasmana-how-to-do-ci-and-cd-of-node-js-application-using-github-actions-860007bebae6)

Code used in the yml file is listed below:
```
# - name: docker login
    #   env:
    #       DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
    #       DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
    #   run: |
    #      docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
    
    # - name: Build Docker
    #   run: docker build . --file Dockerfile --tag my-image-name:$(date +%s)
    
  
    # - name: Docker Push
    #   run: docker push ${{secrets.DOCKER_USERNAME}}/appbootstrap:mylatest
```
# SocialBank.ga
This is my own VPS at interserver.net. The free domain name was register at FREENOM. It has multiple hosting including Data2Int.com and SocialBank.ga. While I successfully set up the secretkeys on Github with the Host, SSHKEY, PORT and USERNME, I am not able to automatically update the website everytime there is change in code at the local computer. At this stage I am simply not able to trigger the deploy1.yml to execute. Follow steps from: (https://dev.to/knowbee/how-to-setup-continuous-deployment-of-a-website-on-a-vps-using-github-actions-54im)

deploy1.yml is as follows:
```
name: Deployment
  on: 
   push:
     branches: [ master]

  jobs:
   job_one:
     name: Deploy
     runs-on: ubuntu-latest
     steps:
     - name: test
       uses: appleboy/ssh-action@master
       env:
        HOST: ${{secrets.HOST}}
        USERNAME: ${{secrets.USERNAME}}
        PORT: ${{secrets.PORT}}
        SSHKEY: ${{secrets.SSHKEY}}
       with:
        source: "."
        target: "var/www/socialbank.ga/html/"
     - name: Execute
       uses: appleboy/ssh-action@master
       with: 
        HOST: ${{secrets.HOST}}
        USERNAME: ${{secrets.USERNAME}}
        PORT: ${{secrets.PORT}}
        SSHKEY: ${{secrets.SSHKEY}}
        script: ls
  
  ```

# Lessons Learned

Even though the demo HTML website works out of the box, because of it bootstrap features, it tends to fail on Github testing because of the numerous node.js dependencies that have been deprecated. A related problem is that if the global gulp.cli needs to be installed it requires the sudo command. It may therefore not be practical or possible to create a docker image in the normal way and therefore the gulp dependencies may need to be pre-installed in the selected linux distro. 

Overall my experiences seems to suggest it it may be best to SSH into the production server to pull the project once it is stable and tested. So the current project suits me just fine. This may still give us the headache of moving from local to the live server where there are often other dependencies by the hosting platforms. Docker may be usful to quickly test out the Apps on different platforms. Unless I move completely hosting on the cloud, for me using docker to host applications may not be best way to move forward.



# Small Apps By Themefisher
Small Apps is a clean and modern Free responsive app landing-page template for Mobile App. Built with Bootstrap 4.x frontend Framework. The codebase is well organized, very easy to customize, and SEO optimized.


<!-- demo -->
## Example Site
| [![](screenshots/homepage.png)](https://demo.themefisher.com/small-apps/) | [![](screenshots/homepage-2.png)](http://localhost:3000/homepage-2.html) | [![](screenshots/homepage-3.png)](https://demo.themefisher.com/small-apps/homepage-3.html) |
|:---:|:---:|:---:|
| **Homepage 1**  | **Homepage 2**  | **Homepage 3**  |
| [![](screenshots/about.png)](https://demo.themefisher.com/small-apps/about.html) | [![](screenshots/career.png)](https://demo.themefisher.com/small-apps/career.html) | [![](screenshots/team.png)](https://demo.themefisher.com/small-apps/team.html) |
| **About** | **Career** | **Team** |
| [![](screenshots/blog-r.png)](https://demo.themefisher.com/small-apps/blog.html) | [![](screenshots/blog-details.png)](https://demo.themefisher.com/small-apps/blog-single.html) | [![](screenshots/contact.png)](https://demo.themefisher.com/small-apps/contact.html) |
| **Blogs** | **Blog Details** | **Contact** |

👉🏻[View Live Preview](https://demo.themefisher.com/small-apps/)

<!-- resources -->
## Pages
* **Homepage 1**
* **Homepage 2**
* **Homepage 3**
* **About**
* **Team**
* **Career**
* **Blog**
* **Blog Details**
* **Contact**
* **FAQ**
* **Coming Soon**
* **404**
* **Privacy Policy**
* **Signin**
* **Signup**


<!-- download -->
## Download And installation
Download this template from any following options:

* Download from [Github](https://github.com/themefisher/Small-Apps-Bootstrap-App-Landing-Template/archive/master.zip)
* Clone the repository: `git clone https://github.com/themefisher/Small-Apps-Bootstrap-App-Landing-Template.git`
* Download from [Themefisher](https://themefisher.com/products/small-apps-free-app-landing-page-template/)


<!-- installation -->
### Basic Usage
After downloading template, you can simply edit the HTML and CSS files from the `theme` folder. To preview the changes you make to the code, you can open the index.html file in your web browser.

### Advanced Usage
For advanced usage you have some dependencies to install. Then you can run it on your localhost. You can view the package.json file to see which scripts are included.

#### Install Dependencies
* **Node Installation:** [Install node js](https://nodejs.org/en/download/)
* **Gulp Installation:** Install gulp globally from your terminal 
```
npm install --global gulp-cli
```
Or visit original [docs](https://gulpjs.com/docs/en/getting-started/quick-start)

#### Run Theme
After succesfully install those dependencies, open this theme with any IDE [[VS Code](https://code.visualstudio.com/) recommended], and then open internal terminal of IDE [vs code shortcut <code>ctrl/cmd+\`</code>]

* Install node package modules
```
npm install
```
* Run gulp
```
gulp
```
After that, it will open up a preview of the template in your default browser, watch for changes to core template files, and live reload the browser when changes are saved.

👉🏻 [visit documentation](https://docs.themefisher.com/airspace/)


<!-- reporting issue -->
## Reporting Issues
We use GitHub Issues as the official bug tracker for the Small Apps Template. Please Search [existing issues](https://github.com/themefisher/Small-Apps-Bootstrap-App-Landing-Template/issues). It’s possible someone has already reported the same problem.
If your problem or idea has not been addressed yet, feel free to [open a new issue](https://github.com/themefisher/Small-Apps-Bootstrap-App-Landing-Template/issues).

<!-- support -->
## Technical Support or Questions (Paid)
If you have questions or need help integrating the product please [contact us](mailto:mehedi@themefisher.com) instead of opening an issue.

<!-- licence -->
## License
Copyright &copy; 2021 Designed & Developed by [Themefisher](https://themefisher.com)

**Code License:** Released under the [MIT](https://github.com/themefisher/Small-Apps-Bootstrap-App-Landing-Template/blob/master/LICENSE) license.

**Image license:** The images are only for demonstration purposes. They have their own licence, we don't have permission to share those image.

<!-- resources -->
## Resources
Some third-party plugins that we used to build this template. Please check their licence.
* **Bootstrap v4.5**: https://getbootstrap.com/docs/4.5/getting-started/introduction/
* **Jquery v3.5.1**: https://jquery.com/download/
* **Themify Icons**: https://themify.me/themify-icons
* **Google Fonts**: http://fonts.google.com/
* **AOS**: https://michalsnik.github.io/aos/
* **Fancybox**: http://fancyapps.com/fancybox/
* **Slick**: https://kenwheeler.github.io/slick/
* **SyoTimer**: http://syomochkin.xyz/folio/syotimer/demo.html
