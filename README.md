# Lambda Image Manager

Lambda Image Manager is AWS Lambda function that store, get, manipulate images in AWS S3.  

If you are using Cloudinary or Imgix like service just for resizing or basic image manipulation, maybe you don't need them anymore. 

## Before Start

If you aren't used to [Serverless](https://serverless.com/) or AWS Lambda, I highly recommend that read Serverless docs first.   

Remember! AWS provides free tier amount, but this whole service is not **FREE**.

### Prerequisites

- Make empty AWS S3 bucket for image file store.  
~~- Make and set AWS DynamoDB for cache.~~(Not supported yet)

### Installing

```
git clone https://github.com/TylorShin/lambda-image-manager.git
cd lambda-image-manager
npm install
```

And set production environment.  
(If you want to stage or other)

```
# /env/prod.yml
S3_BUCKET_NAME: lambdaImage
S3_DEST_PREFIX: images/original
```

The S3 folder structure should be like below.
```
# lambdaImage Bucket

/root
  /images
    /original
```

Then if you ready to deploy Serverless project,
just run

```
npm run deploy:prod
```

## Running the tests

WIP


## Deployment

```
npm run deploy:prod
```

## Built With

* [Serverless](https://serverless.com/) - The web framework used

## Contributing

WIP

## Authors

* **breath103** - *Tech lead & Initial idea maker*
* **Tylor Shin** - *Project Manager* - [TylorShin](https://github.com/TylorShin)

## License

WIP
