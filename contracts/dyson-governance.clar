;; Dyson Sphere Governance Contract

(define-map proposals
  { proposal-id: uint }
  {
    title: (string-ascii 100),
    description: (string-utf8 1000),
    proposer: principal,
    status: (string-ascii 20),
    votes-for: uint,
    votes-against: uint
  }
)

(define-data-var proposal-count uint u0)

(define-map votes
  { proposal-id: uint, voter: principal }
  { vote: bool }
)

(define-public (create-proposal (title (string-ascii 100)) (description (string-utf8 1000)))
  (let
    (
      (new-proposal-id (+ (var-get proposal-count) u1))
    )
    (map-set proposals
      { proposal-id: new-proposal-id }
      {
        title: title,
        description: description,
        proposer: tx-sender,
        status: "active",
        votes-for: u0,
        votes-against: u0
      }
    )
    (var-set proposal-count new-proposal-id)
    (ok new-proposal-id)
  )
)

(define-public (vote (proposal-id uint) (vote-for bool))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) (err u404)))
      (previous-vote (map-get? votes { proposal-id: proposal-id, voter: tx-sender }))
    )
    (asserts! (is-eq (get status proposal) "active") (err u403))
    (if (is-some previous-vote)
      (if (is-eq (get vote (unwrap-panic previous-vote)) vote-for)
        (ok true)
        (begin
          (map-set proposals
            { proposal-id: proposal-id }
            (merge proposal {
              votes-for: (if vote-for (+ (get votes-for proposal) u1) (- (get votes-for proposal) u1)),
              votes-against: (if vote-for (- (get votes-against proposal) u1) (+ (get votes-against proposal) u1))
            })
          )
          (ok (map-set votes { proposal-id: proposal-id, voter: tx-sender } { vote: vote-for }))
        )
      )
      (begin
        (map-set proposals
          { proposal-id: proposal-id }
          (merge proposal {
            votes-for: (if vote-for (+ (get votes-for proposal) u1) (get votes-for proposal)),
            votes-against: (if vote-for (get votes-against proposal) (+ (get votes-against proposal) u1))
          })
        )
        (ok (map-set votes { proposal-id: proposal-id, voter: tx-sender } { vote: vote-for }))
      )
    )
  )
)

(define-public (close-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) (err u404)))
    )
    (asserts! (is-eq (get status proposal) "active") (err u403))
    (ok (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal {
        status: (if (> (get votes-for proposal) (get votes-against proposal)) "passed" "rejected")
      })
    ))
  )
)

(define-read-only (get-proposal (proposal-id uint))
  (ok (map-get? proposals { proposal-id: proposal-id }))
)

