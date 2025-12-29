from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """
    Custom pagination class for the project.
    Can be used on specific ViewSets that need pagination.
    """
    page_size = 5
    page_query_param = 'page'
    page_size_query_param = 'size'
    max_page_size = 5
