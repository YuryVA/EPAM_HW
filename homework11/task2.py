class Order:
    """
    class to change discount program from outer conditions
    """

    morning_discount = 0.25

    def __init__(self, price, discount=None):
        self.price = price
        self.discount = discount

    def final_price(self):
        if self.discount:
            return self.price - self.discount(self)
        return self.price - self.price * self.morning_discount


def morning_discount(order):
    """
    first type of discount program
    """

    return order.price * 0.5


def elder_discount(order):
    """
    second type of discount program
    """

    return order.price * 0.9
