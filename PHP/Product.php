<?php
/**
 * The template for all products for use in the assignment.
 * 
 * @author Daniel Foster
 */
class Product {
    /**
     * The code for the product.
     * 
     * @var string
     */
    private string $code;
    /**
     * The name for the product.
     * 
     * @var string
     */
    private string $name;

    /**
     * @var int
     * The price is assumed to be in GDP and is represented in pence with an integer to prevent floating point accuracy errors.
     */
    private int $price;

    /**
     * A link to an image that I have hard-coded into the array at the bottom that stores the objects of this class in them.
     * @var string
     */
    private string $image;

    public function __construct(string $productCode, string $productName, float $productPrice, string $productImage) {
        $this->setCode($productCode);
        $this->setName($productName);
        $this->setPrice($productPrice);
        $this->setImage($productImage);
    }

    /**
     * Return the price of the product in either an integer representing the price in pence or a string representing
     * the price in GDP.
     * 
     * @param bool A flag to determine whether we want to return the price in pence as an integer or pounds as a string.
     * @return int|string The number representation of the price of the product eityher in a string or in pence as an integer.
     */
    public function getPrice(bool $inPence = false): int|string {
        if ($inPence) return $this->price;
        else {
            // Convert the price into a floating point data type.
            $floatingVariant = (float)($this->price / 100);

            // Convert it into a string with two digits of representation.
            $stringRepresentation = number_format($floatingVariant, 2);

            // Return the string representation of the price with a '£' prepended to the string.
            return "£$stringRepresentation";
        }
    }

    /**
     * Return the prodcut code for the product
     * 
     * @return string The code for the product.
     */
    public function getCode(): string {
        return $this->code;
    }

    /**
     * Return the prodcut name for the product
     * 
     * @return string The name for the product.
     */
    public function getName(): string {
        return $this->name;
    }

    /**
     * Update the code property with valid input or return false.
     * 
     * @param string The input string to replace the current value for the code property.
     * @return bool Determines whether the property was successfully updated.
     */
    public function setCode(string $input): bool {
        /* We only want to update the code property as and when the input is valid. Input is only valid when the code starts
           with a P and is followed by three digits. This may change over time to allow for more digits. */
        if (preg_match('/^P\d{3}$/', $input)) {
            $this->code = $input;
            return true;
        }
        else return false;
    }
    /**
     * Update the propety name with a non-empty string. If the string is empty then return false.
     * 
     * @param string The input string to replace the current value for the name property.
     * @return bool Determines whether the property was successfully updated.
     */
    public function setName(string $input): bool {
        if ((bool)$input) {
            $this->name = $input;
            return true;
        }
        else return false;
    }

    /**
     * Update the price with a floating point value that will be converted into an int. Rejects invalid input.
     * 
     * @param string The input string to replace the current value for the name property.
     * @return bool Determines whether the property was successfully updated.
     */
    public function setPrice(float $input): bool {
        // We won't have prices that are negative in the system.
        if ($input < 0) return false;

        /* We should only have two decimal points at the most in this input. It is entirely possible to have 1 decimal
           point in examples such as 5.4. Anything more than 2 decimal points is invalid. */

        /* The logic here is that we can get how many decimal points occur after the '.' by getting the length of the
           element that occurs after the split on the decimal point. */
        $priceExploded = explode('.', "$input");
        if (isset($priceExploded[1]) && strlen($priceExploded[1]) > 2) return false;

        // Convert the price into pence.
        $newPriceInPence = (int)$input * 100;
        $this->price = $newPriceInPence;
        return true;
    }

    /**
     * Retreive the image path for the product.
     * 
     * @return string The image path for the product.
     */
    public function getImage(): string {
        return $this->image;
    }

    /**
     * Set the image for the product if the image returns something other than null.
     */
    private function setImage(string $input): bool {
        $input = './Images/'.$input;

        /* We only want to assign images to our product. We ensure that we are assigning images by checking the file type
           of the url to the image. We target the file type by exploding the string and focussing on the last element. */
        $explodedString = explode('.', $input);
        $fileType = $explodedString[count($explodedString) - 1];

        // Check to see whether the image has a supported file type for what we want.
        if (!in_array($fileType, ['jpg', 'jpeg', 'png'])) {
            $this->image = '';
            return false;
        }

        // Now that we have confirmed the file type of the image is valid, we need to check for content.
        $request = file_get_contents($input);
        

        // If the result of request returns nothing then assign an empty string.
        $this->image = $request ? $input : '';
        return true;
    }
}

/**
 * An array of four products as determined by the assignment.
 * 
 * @var Product[]
 * @global true
 */
$products = [
    'P001' => new Product('P001', 'Photography', 200.00, 'Photography.jpg'),
    'P002' => new Product('P002', 'Floorplan', 100.00, 'Floorplan.jpg'),
    'P003' => new Product('P003', 'Gas Certificate', 83.50, 'GasCertificate.jpg'),
    'P004' => new Product('P004', 'EIRC Certificate', 51.00, 'EIRCCertificate.png'),
];