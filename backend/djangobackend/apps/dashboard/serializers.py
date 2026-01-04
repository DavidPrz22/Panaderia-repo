from rest_framework import serializers


class SalesTodaySerializer(serializers.Serializer):
    """Serializer for daily sales summary"""
    total_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_transactions = serializers.IntegerField()
    total_items_sold = serializers.IntegerField()
    percentage_vs_yesterday = serializers.DecimalField(
        max_digits=5, decimal_places=2, required=False, allow_null=True
    )


class PendingOrdersSerializer(serializers.Serializer):
    """Serializer for pending orders summary"""
    total_pending = serializers.IntegerField()
    due_today = serializers.IntegerField()
    approaching_deadline = serializers.IntegerField()
    percentage_vs_yesterday = serializers.DecimalField(
        max_digits=5, decimal_places=2, required=False, allow_null=True
    )


class StockAlertsSerializer(serializers.Serializer):
    """Serializer for stock alerts summary"""
    total_alerts = serializers.IntegerField()
    under_reorder_point = serializers.IntegerField()
    out_of_stock = serializers.IntegerField()
    expired = serializers.IntegerField()
    critical_count = serializers.IntegerField()


class RecentProductionsSerializer(serializers.Serializer):
    """Serializer for recent productions summary"""
    total_productions = serializers.IntegerField()
    percentage_vs_previous = serializers.DecimalField(
        max_digits=5, decimal_places=2, required=False, allow_null=True
    )
    total_items_produced = serializers.IntegerField(required=False, allow_null=True)


class SalesTrendItemSerializer(serializers.Serializer):
    """Single day sales trend data"""
    date = serializers.DateField()
    total_sales = serializers.DecimalField(max_digits=12, decimal_places=2)


class SalesTrendDataSerializer(serializers.Serializer):
    """Sales trend for last 7 days"""
    data = SalesTrendItemSerializer(many=True)


class TopProductItemSerializer(serializers.Serializer):
    """Single product in top products list"""
    product_name = serializers.CharField()
    quantity_sold = serializers.IntegerField()
    product_type = serializers.ChoiceField(choices=['resale', 'final'])


class TopProductsDataSerializer(serializers.Serializer):
    """Top 10 selling products"""
    data = TopProductItemSerializer(many=True)


class RecentPurchaseItemSerializer(serializers.Serializer):
    """Single purchase order in recent list"""
    id = serializers.IntegerField()
    order_number = serializers.CharField()
    supplier_name = serializers.CharField()
    order_date = serializers.DateField()
    status = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class RecentPurchasesSerializer(serializers.Serializer):
    """Last 10 purchase orders"""
    data = RecentPurchaseItemSerializer(many=True)


class RecentSaleItemSerializer(serializers.Serializer):
    """Single sale in recent sales list"""
    id = serializers.IntegerField()
    sale_number = serializers.CharField()
    customer_name = serializers.CharField(allow_null=True, required=False)
    sale_datetime = serializers.DateTimeField()
    payment_method = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class RecentSalesSerializer(serializers.Serializer):
    """Last 10 sales from Ventas model"""
    data = RecentSaleItemSerializer(many=True)
