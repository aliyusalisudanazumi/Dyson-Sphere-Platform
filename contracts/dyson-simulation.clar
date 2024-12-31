;; Dyson Sphere Simulation Contract

(define-data-var total-energy-captured uint u0)
(define-data-var total-energy-distributed uint u0)

(define-map energy-distribution
  { sector: (string-ascii 20) }
  { allocated: uint, used: uint }
)

(define-public (simulate-energy-capture (amount uint))
  (ok (var-set total-energy-captured (+ (var-get total-energy-captured) amount)))
)

(define-public (simulate-energy-distribution (sector (string-ascii 20)) (amount uint))
  (let
    (
      (current-distribution (default-to { allocated: u0, used: u0 } (map-get? energy-distribution { sector: sector })))
    )
    (asserts! (<= amount (- (var-get total-energy-captured) (var-get total-energy-distributed))) (err u403))
    (var-set total-energy-distributed (+ (var-get total-energy-distributed) amount))
    (ok (map-set energy-distribution
      { sector: sector }
      { allocated: (+ (get allocated current-distribution) amount), used: (get used current-distribution) }
    ))
  )
)

(define-public (use-energy (sector (string-ascii 20)) (amount uint))
  (let
    (
      (current-distribution (unwrap! (map-get? energy-distribution { sector: sector }) (err u404)))
    )
    (asserts! (<= (+ (get used current-distribution) amount) (get allocated current-distribution)) (err u403))
    (ok (map-set energy-distribution
      { sector: sector }
      { allocated: (get allocated current-distribution), used: (+ (get used current-distribution) amount) }
    ))
  )
)

(define-read-only (get-energy-stats)
  (ok {
    total-captured: (var-get total-energy-captured),
    total-distributed: (var-get total-energy-distributed),
    available: (- (var-get total-energy-captured) (var-get total-energy-distributed))
  })
)

(define-read-only (get-sector-energy (sector (string-ascii 20)))
  (ok (map-get? energy-distribution { sector: sector }))
)

