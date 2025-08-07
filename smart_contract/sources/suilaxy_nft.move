module suilaxy_nft::suilaxy_nft {
        use std::string::String;
        use sui::event;        
        use sui::sui::SUI;
        use sui::coin::{Self, Coin};
        use sui::balance::{Self, Balance};
        use sui::random::{Random};
        use suilaxy_nft::create_nft_with_random_attributes::{Self as nft_attributes, NFT};

        const TARGET_ADDRESS: address = @0xa84a74d18762c8981749f539849f72888ffe554069d6b37451aff73d6c20c171;
        const OWNER_COUNTER_SHOP : address = @0x476aa5cda4a10276eb02d9b38e148c5186915cd47c5dffbf1ef14d4af3083263;

        #[test_only]
        public fun get_owner_counter_shop_address(): address {
            OWNER_COUNTER_SHOP
        }

        // STRUCT DEFINITIONS 
        public struct Counter has key {
            id: UID,
            owner: address,
            value: u64
        }

        public struct NFTOwnerCap has key { 
            id: UID 
        }

        public struct NFTShop has key {
            id: UID,
            price: u64,
            balance: Balance<SUI>
        }

        public struct ProfitsCollected has copy, drop {
            amount: u64
        }

        // EVENTS
        public struct NFTMinted has copy, drop {
            object_id: ID,
            creator: address,
            name: String,   
        }

        fun init(ctx: &mut TxContext){
            assert!(ctx.sender() == OWNER_COUNTER_SHOP, 0);

            // Create a new counter object and share it between senders.
            // The counter is initialized with a value of 1000 => 1000 NFTs
            transfer::share_object(Counter {
            id: object::new(ctx),
            owner: ctx.sender(),
            value: 5,
            });

            // Init author and shop 
            // NFT PRICE 1000 SUI
            transfer::transfer(NFTOwnerCap {
                id: object::new(ctx)
            }, ctx.sender());

            transfer::share_object(NFTShop {
                id: object::new(ctx),
                price: 100000000, // NFT PRICE 
                balance: balance::zero()
            })
        }

        /// Function used to create a mint transaction.
        /// Stake is taken from the player's coin and added to the shop's balance.
        /// @param NFTShop: The shop object
        /// @param Counter: The counter object to keep track of the number of NFTs minted
        /// @param rest => NFT attributes
        fun mint_to_sender(
            name: String,
            description: String,
            url: String,
            random: &Random,
            ctx: &mut TxContext,
        ) : NFT {
            // Create the NFT with attributes using the generated UID
            let nft = nft_attributes::create_nft_with_attributes_from_frame(
                name,
                description,
                url,
                random,
                ctx,
            );
            nft
        }

        entry fun send_nft_to_sender(
            name: String,
            description: String,
            url: String,
            random: &Random,
            payment: Coin<SUI>,
            shop: &mut NFTShop,
            counter: &mut Counter,
            ctx: &mut TxContext,)
        {

            let nft = mint_to_sender(name, description, url, random, ctx);

            // Check if there are still NFTs available to mint
            assert!(counter.value > 0, 0);

            // Check if the payment is sufficient for the price of the NFT
            assert!(payment.value() >= shop.price, 0);

            // Add the payment to the shop's balance
            let stake = payment.into_balance();
            shop.balance.join(stake);

            // Emit an event indicating that the NFT has been minted
            event::emit(NFTMinted {
                object_id: nft_attributes::get_nft_uid(&nft).to_inner(),
                creator: ctx.sender(),
                name: name,
            });

            // Decrease the available NFTs count in the counter
            counter.value = counter.value - 1;

            // Transfer the newly created NFT to the sender
            transfer::public_transfer(nft, ctx.sender());
        }


        // Function used to colelc profits from the shop to the TARGET_ADDRESS
        /// @param NFTShop: The shop object
        public fun collect_profits(shop: &mut NFTShop, ctx: &mut TxContext) {
            assert!(ctx.sender() == TARGET_ADDRESS, 0);
            let amount = shop.balance.value();
            event::emit(ProfitsCollected { amount });
            let coin = coin::take(&mut shop.balance, amount, ctx);
            transfer::public_transfer(coin, TARGET_ADDRESS);
        }
    }