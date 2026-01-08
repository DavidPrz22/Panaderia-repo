Implement page-based pagination or (also know offset pagination) for data list in features like materias primas, productos intermedios, productos finales, productos de reventa and recetas

    UI requirements:
        - For each feature theres a list table to show relevant data of the element ( materias primas, productos intermedios, productos finales, productos de reventa or recetas),
        only up 15 elements will be shown in this list at a time
        - Use a paginator component to show the number of pages that can be seen.
        - Load data from the backend using infinite pagination
        - After clicking on a page number, the data will be displayed on the table and get cached
        - Maintain the behavior of clicking on a list item to open a panel with the details of the element
        - Use React Query to handle pagination
        - Update types related to the data list and api files to handle pagination

    Backend requirements:
        - Configure ViewSets with Pagination
        - Verify Pagination Response Format
        - API Endpoints
    


what i have to do:
    - Give context on how each feature handles display data through llms
    - what the existing pagination class does and how it works
    - Context on viewsets and serializers for each feature
    - how pagination works in the backend and frontend