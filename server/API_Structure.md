# Fast API Modules
* __api__: Contains all HTTP endpoint definitions and API router configuration
* __core__: Core application configuration and security functionality
* __crud__: Database operations following the Create-Read-Update-Delete pattern
* __db__: Database connection and session management
* __models__: SQLAlchemy models representing database tables (ORM)
* __schemas__: Pydantic models for request/response validation and serialization
* __services__: Business logic and external service integrations (OCR, AI)

<hr style="height:4px; background:grey">

# Endpoints
## Login Endpoints

### POST /api/v1/login/access-token
* __Description__: OAuth2 compatible token login to get an access token for future requests
* __Request__ Body: Form data with `username` (user's email) and `password` fields
* __Response__: JSON with `access_token` and `token_type`


### POST /api/v1/login/test-token
* __Description__: Test if an access token is valid
* __Security__: Requires Bearer token authentication
* __Response__: User information if token is valid

## Documentation Enpoints

### POST /api/v1/documents/
* __Description__: Upload a new document and add it to the processing queue
* __Request__ Body: Multipart form with a PDF file
* __Security__: Requires authentication
* __Response__: Document object with metadata

### GET /api/v1/documents/
* __Description__: Retrieve a list of documents
* __Query__ Parameters: `skip` and `limit` for pagination
* __Security__: Requires authentication
* __Response__: Array of Document objects

### GET /api/v1/documents/{id}
* __Description__: Get a specific document by ID
* __Path__ Parameter: `id` - Document ID
* __Security__: Requires authentication
* __Response__: Document object

### GET /api/v1/documents/{id}/download
* __Description__: Download the original document
* __Path Parameter__: `id` - Document ID
* __Security__: Requires authentication
* __Response__: File download

### DELETE /api/v1/documents/{id}
* __Description__: Delete a document
* __Path Parameter__: `id` - Document ID
* __Security__: Requires authentication
* __Response__: Deleted document object

### PUT /api/v1/documents/{id}
* __Description__: Update a document's metadata
* __Path Parameter__: `id` - Document ID
* __Request__ Body: DocumentUpdate object with fields to update
* __Security__: Requires authentication
* __Response__: Updated document object

### POST /api/v1/documents/{id}/reprocess
* __Description__: Reprocess a document (add it to the queue again)
* __Path Parameter__: `id` - Document ID
* __Query__ Parameter: priority - Processing priority
* __Security__: Requires authentication
* __Response__: Document object

## Queue Endpoints

### POST /api/v1/queue/
* __Description__: Create a new queue item
* __Request Body__: QueueCreate object with `document_id`, `status`, and `priority`
* __Security__: Requires authentication
* __Response__: Queue object

### GET /api/v1/queue/
* __Description__: Retrieve queue items
* __Query Parameters__: `skip` and `limit` for pagination
* __Security__: Requires authentication
* __Response__: Array of Queue objects

### GET /api/v1/queue/{id}
* __Description__: Get a specific queue item by ID
* __Path Parameter__: `id` - Queue item ID
* __Security__: Requires authentication
* __Response__: Queue object

### PUT /api/v1/queue/{id}
* __Description__: Update a queue item
* __Path Parameter__: `id` - Queue item ID
* __Request__ Body: QueueUpdate object with fields to update
* __Security__: Requires superuser authentication
* __Response__: Updated Queue object

### DELETE /api/v1/queue/{id}
* __Description__: Delete a queue item
* __Path Parameter__: `id` - Queue item ID
* __Security__: Requires superuser authentication
* __Response__: Deleted Queue object


## Results Endpoints
### GET /api/v1/results/
* __Description__: Retrieve processing results
* __Query Parameters__: `skip` and `limit` for pagination
* __Security__: Requires authentication
* __Response__: Array of Result objects

### GET /api/v1/results/{id}
* __Description__: Get a specific result by ID
* __Path Parameter__: `id` - Result ID
* __Security__: Requires authentication
* __Response__: Result object

### GET /api/v1/results/document/{document_id}
* __Description__: Get result by document ID
* __Path Parameter__: `document_id` - Document ID
* __Security__: Requires authentication
* __Response__: Result object

### PUT /api/v1/results/{id}/validate
* __Description__: Validate a processing result
* __Path Parameter__: `id` - Result ID
* __Query Parameters__: `status` (validated/rejected) and optional `notes`
* __Security__: Requires authentication
* __Response__: Updated Result object

### PUT /api/v1/results/{id}
* __Description__: Update a result
* __Path Parameter__: `id` - Result ID
* __Request Body__: ResultUpdate object with fields to update
* __Security__: Requires authentication
* __Response__: Updated Result object

## User Endpoints
### GET /api/v1/users/
* __Description__: Retrieve a list of users
* __Query Parameters__: `skip` and `limit` for pagination
* __Security__: Requires superuser authentication
* __Response__: Array of User objects

### POST /api/v1/users/
* __Description__: Create a new user
* __Request Body__: UserCreate object with `email`, `password`, and optional fields
* __Security__: Requires superuser authentication
* __Response__: User object

### GET /api/v1/users/me
* __Description__: Get current user information
* __Security__: Requires authentication
* __Response__: User object

### PUT /api/v1/users/me
* __Description__: Update own user information
* __Request Body__: Can include `password`, `full_name`, and `email`
* __Security__: Requires authentication
* __Response__: Updated User object