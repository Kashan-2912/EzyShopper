
# Welcome to EzyShopper – Your One-Stop Shopping Destination!

EzyShopper is a dynamic e-commerce platform designed to revolutionize your online shopping experience. Whether you’re looking for the latest gadgets, trendy apparel, home essentials, or unique gifts, EzyShopper offers a wide range of high-quality products to meet all your needs.

With an intuitive interface, seamless navigation, and personalized recommendations, EzyShopper makes shopping easy, enjoyable, and efficient. Our secure payment options, fast delivery services, and responsive customer support ensure a hassle-free experience from start to finish.

Discover the joy of shopping made simple with EzyShopper—where convenience meets choice!




# Administrator Features

(i) Admin can add product with details including image.

(ii) Admin can make the product featured.

(iii) Admin can delete the product.

(iv) Admin has Analytics Dashboard which shows total users, total products, total sales and total revenue in graph (chart) format.


# User Features

(i) Home page featuring all products.

(ii) Login / Signup Page for user.

(iii) Cart page for user.

(iv) Featured products appearing on homepage (coming from redis cache).

(v) People also bought product recommendations. (mongoose aggregation pipelines)

(vi) Show cart products on cart page.

(vii) Order summary on cart page.

(viii) Apply coupon on cart page if last order cost was 200$ or more.

(ix) Easy stripe payments using credit/debit card.

(x) Purchase success / cancel page after payment.
# Tech Stack

## Frontend
- React for frontend
- Tailwind CSS for styling
- Framer-motion for adnimations

## Backend
- MongoDB (node, express)

## Others
- Zustand for state management
- Recharts for chart
- Stripejs for stripe payments
- Cloudinary for uploading image
- Redis for caching
- JWT for authentication


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT=`

`MONGO_URI=`

`UPSTASH_REDIS_URL=`

`ACCESS_TOKEN_SECRET=`

`REFRESH_TOKEN_SECRET=`

`CLOUDINARY_CLOUD_NAME=`

`CLOUDINARY_API_KEY=`

`CLOUDINARY_API_SECRET=`

`STRIPE_SECRET_KEY=`

`CLIENT_URL=`

# Run Locally

### Clone the project

```bash
  git clone https://github.com/Kashan-2912/EzyShopper.git
```

### Go to the project directory

```bash
  cd my-project
```

### Install dependencies

```bash
  npm i in root, also npm i in frontend folder
```

### Start the server

```bash
  first:
  npm run dev (in root)

  then: 
  npm run dev (in frontend folder)
```

## 🔗 Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/muhammad-kashan-ashraf)

