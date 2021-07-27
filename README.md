# Atelier - Back End Capstone

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
Atelier is a back-end ratings and reviews microservice optimization for a product eCommerce web application. This project was horizontally scaled across 4 AWS EC2 instances for maximum throughput and utilized NGINX for caching and round-robin load balancing.

* Improved from 1,500 clients/seconds with average 289ms and 19.9% error rate to 6,000 clients/seconds with 63 ms and 0% error rate
![loader1](https://user-images.githubusercontent.com/78133003/127227454-1defdd7f-287d-4564-82c1-435e493a5d55.png)

* Added B-Tree Indexing and EXPLAIN ANALYZE results decreased from 4520ms to .369ms 
![explainAnalyze](https://user-images.githubusercontent.com/78133003/127227680-27e65382-f4b9-42cb-adf6-014ece7b8e29.png)

	
## Technologies
Project is created with:
* Express
* NGINX
* Loader.io
* PostgreSQL
	
## Setup
To run this project, install it locally using npm:

```
$ cd ../Reviews_kd
$ npm install
$ npm run build
$ npm start
```
