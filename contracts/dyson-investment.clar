;; Dyson Sphere Investment Contract

(define-fungible-token dyson-token)

(define-map investments
  { investor: principal }
  { amount: uint }
)

(define-public (invest (amount uint))
  (let
    (
      (current-investment (default-to { amount: u0 } (map-get? investments { investor: tx-sender })))
    )
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (try! (ft-mint? dyson-token amount tx-sender))
    (ok (map-set investments
      { investor: tx-sender }
      { amount: (+ (get amount current-investment) amount) }
    ))
  )
)

(define-public (withdraw (amount uint))
  (let
    (
      (current-investment (unwrap! (map-get? investments { investor: tx-sender }) (err u404)))
    )
    (asserts! (<= amount (get amount current-investment)) (err u403))
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    (try! (ft-burn? dyson-token amount tx-sender))
    (ok (map-set investments
      { investor: tx-sender }
      { amount: (- (get amount current-investment) amount) }
    ))
  )
)

(define-read-only (get-investment (investor principal))
  (ok (map-get? investments { investor: investor }))
)

(define-read-only (get-total-investment)
  (ok (ft-get-supply dyson-token))
)

