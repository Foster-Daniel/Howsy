<?php
    require_once './PHP/Product.php'
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./CSS/Styles.css">
</head>
<body>
    <header>
        <h1>HOWSY!</h1>
    </header>
    <main>
        <?php
            foreach ($products as $product) { ?>
                <div class="product" id="product-<?= $product->getCode() ?>"
                    data-code="<?= $product->getCode() ?>"
                    data-name="<?= $product->getName() ?>"
                    data-price="<?= $product->getPrice() ?>">
                        <div class="image" style="background-image: url('<?= $product->getImage() ?>')"></div>
                        <div class="information">
                            <h2><?= $product->getName() ?></h2>
                            <h3><?= $product->getPrice() ?></h3>
                        </div>
                        <button onclick="addItemToBasket('<?= $product->getCode() ?>',
                                                         '<?= $product->getName() ?>',
                                                         '<?= $product->getPrice() ?>')">Buy</button>
                
                </div>
            <?php
            }
            ?>
    </main>
    <div id="basket">
        <h2>Basket</h2>
        <input type="text" name="discountCode" id="discount-code" oninput="generateCombinedOverallPrice()">
        <h3 style="display: none" id="combined-total-price">Total Price: </h3>
        <h3 id="no-items-message">No items in the basket.</h3>
        <div id="basket-items"></div>
    </div>
    <script>
            class Product {
            constructor(productCode, productName, productPrice, productQuantity) {
                this.code     = productCode
                this.name     = productName
                this.price    = productPrice
                this.quantity = productQuantity
            }
        }

        PRODUCTS = [
            <?php
                foreach ($products as $product) {
                    echo "new Product('".$product->getCode().
                    "', '".$product->getName().
                    "', '".$product->getPrice().
                    "', 0), ";
                }
            ?>        
        ]
    </script>
    <script src="./JavaScript/Index.js">
    
    </script>
</body>
</html>
