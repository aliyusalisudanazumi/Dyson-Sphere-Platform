;; Dyson Sphere Construction Contract

(define-data-var current-phase uint u0)

(define-map construction-phases
  { phase-id: uint }
  {
    name: (string-ascii 50),
    description: (string-utf8 500),
    resource-requirements: (list 10 {
      resource: (string-ascii 20),
      amount: uint
    }),
    status: (string-ascii 20)
  }
)

(define-map resource-allocation
  { resource: (string-ascii 20) }
  { allocated: uint, used: uint }
)

(define-public (add-construction-phase (name (string-ascii 50)) (description (string-utf8 500)) (resource-requirements (list 10 {
    resource: (string-ascii 20),
    amount: uint
  })))
  (let
    (
      (new-phase-id (+ (var-get current-phase) u1))
    )
    (map-set construction-phases
      { phase-id: new-phase-id }
      {
        name: name,
        description: description,
        resource-requirements: resource-requirements,
        status: "planned"
      }
    )
    (var-set current-phase new-phase-id)
    (ok new-phase-id)
  )
)

(define-public (update-phase-status (phase-id uint) (new-status (string-ascii 20)))
  (let
    (
      (phase (unwrap! (map-get? construction-phases { phase-id: phase-id }) (err u404)))
    )
    (ok (map-set construction-phases
      { phase-id: phase-id }
      (merge phase { status: new-status })
    ))
  )
)

(define-public (allocate-resource (resource (string-ascii 20)) (amount uint))
  (let
    (
      (current-allocation (default-to { allocated: u0, used: u0 } (map-get? resource-allocation { resource: resource })))
    )
    (ok (map-set resource-allocation
      { resource: resource }
      { allocated: (+ (get allocated current-allocation) amount), used: (get used current-allocation) }
    ))
  )
)

(define-public (use-resource (resource (string-ascii 20)) (amount uint))
  (let
    (
      (current-allocation (unwrap! (map-get? resource-allocation { resource: resource }) (err u404)))
    )
    (asserts! (<= (+ (get used current-allocation) amount) (get allocated current-allocation)) (err u403))
    (ok (map-set resource-allocation
      { resource: resource }
      { allocated: (get allocated current-allocation), used: (+ (get used current-allocation) amount) }
    ))
  )
)

(define-read-only (get-phase (phase-id uint))
  (ok (map-get? construction-phases { phase-id: phase-id }))
)

(define-read-only (get-resource-allocation (resource (string-ascii 20)))
  (ok (map-get? resource-allocation { resource: resource }))
)

