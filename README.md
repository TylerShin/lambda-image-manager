# Lambda Image Manager

Lambda Image Manager is AWS Lambda function that store, get, manipulate images in AWS S3.

If you are using Cloudinary or Imgix like service just for resizing or basic image manipulation, maybe you don't need them anymore.

## Before Start

If you aren't used to [Serverless](https://serverless.com/) or AWS Lambda, I highly recommend that read Serverless docs first.

Remember! AWS provides free tier amount, but this whole service is not **FREE**.

### Todo List
* Add DynamoDB logic.

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

**IMPORTANT**

![Set API Gateway](https://m7ix47c297.execute-api.us-east-1.amazonaws.com/prod/getImage?id=2017-06-11T03:22:10.250Z&filename=a11ebe37-312f-4178-b43a-517fe801340e)

You should set lambda-image-manager's API Gateway's binary support option.

At API Gateway setting page, set binary option allow header to "image/*".
Then, **Deploy** API Gateway once again in console dashboard.

## Running the tests

WIP


## How It Works
#### getImage
* A browser try to presentation <img /> tag with src property heading our API gateway that trigger lambda function.
* Lambda get request with image id, image file name, image manipulation options.
* Trying to find pre-manipulated result from AWS DynamoDB as cache. If the target image is already manipulated with same option, then read that image's address from DynamoDB and return redirect response to that address.
* If there is no cache, manipulate target image with given options.
* Change the image to Buffer with BASE64 encode.
* After that, store the result to S3 and record result address to DynamoDB with manipulation options.
* return manipulated target image to user.

## Built With

* [Serverless](https://serverless.com/) - The web framework used

## Contributing

WIP

## Authors

* **Tylor Shin** - *Project Manager* - [TylorShin](https://github.com/TylorShin)
* **breath103** - *Tech lead & Initial idea maker* - [breath103](https://github.com/breath103)

## License

WIP
