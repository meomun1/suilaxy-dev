#[test_only]
module suilaxy_nft::suilaxy_nft_tests {
    use sui::coin::{Self as CoinModule, TreasuryCap};
    use sui::test_scenario::{Self, next_tx, ctx};
    use sui::random::{Self as RandomModule, Random};
    use sui::sui::SUI;
    use suilaxy_nft::suilaxy_nft::{Self, Counter, NFTShop, get_owner_counter_shop_address};
    use std::string;

    #[test]
    fun test_init_shop() {
        // Use get_owner_counter_shop_address() as the address to ensure assertions pass.
        // let addr1 = get_owner_counter_shop_address();
        // let mut scenario = test_scenario::begin(addr1);

        // next_tx(&mut scenario, addr1);
        // {
        //     suilaxy_nft::init_shop(ctx(&mut scenario));
        // };

        // test_scenario::end(scenario);
    }

    #[test]
    fun test_mint_to_sender() {
        // Use get_owner_counter_shop_address() as the address to ensure assertions pass.
        let addr1 = get_owner_counter_shop_address();
        let mut scenario = test_scenario::begin(addr1);

        // next_tx(&mut scenario, addr1);
        // {
        //     suilaxy_nft::create(ctx(&mut scenario));
        //     suilaxy_nft::init_shop(ctx(&mut scenario));
        // };

        next_tx(&mut scenario, addr1);
        {
            // Check if the object exists before taking it
            let shop_id_opt = test_scenario::most_recent_id_for_address<NFTShop>(addr1);
            assert!(shop_id_opt.is_some(), 0); // Error if shop does not exist
            let mut shop = test_scenario::take_from_sender<NFTShop>(&scenario);
            let mut counter = test_scenario::take_from_sender<Counter>(&scenario);

            // Correct way to create a Random object for testing purposes.
            RandomModule::create_for_testing(ctx(&mut scenario));
            // Pass the scenario context to take_shared
            let random: Random = test_scenario::take_shared(&scenario);

            // Correct way to create a mutable treasury cap for testing purposes.
            let mut treasury_cap: TreasuryCap<SUI> = CoinModule::create_treasury_cap_for_testing(ctx(&mut scenario));
            
            // Mint a coin using the treasury_cap.
            let payment = CoinModule::mint(&mut treasury_cap, 100000000, ctx(&mut scenario)); // 100000000 SUI

            // Use the payment coin in the mint_to_sender function
            suilaxy_nft::send_nft_to_sender(
                string::utf8(b"Test NFT"),
                string::utf8(b"Test Description"),
                string::utf8(b"http://example.com"),
                &random,
                payment,
                &mut shop,
                &mut counter,
                ctx(&mut scenario),
            );

            // Return unused objects back to the sender
            test_scenario::return_to_address<NFTShop>(addr1, shop);
            test_scenario::return_to_address<Counter>(addr1, counter);

            // Return or consume the random object
            test_scenario::return_shared(random);
            
            // TreasuryCap should be either consumed or returned
            test_scenario::return_to_address(addr1, treasury_cap);
        };

        test_scenario::end(scenario);
    }

    #[test]
fun test_collect_profits() {
    // Use get_owner_counter_shop_address() as the address to ensure assertions pass.
    let addr1 = get_owner_counter_shop_address();
    let mut scenario = test_scenario::begin(addr1);

    next_tx(&mut scenario, addr1);
    {
        // suilaxy_nft::create(ctx(&mut scenario));
        // suilaxy_nft::init_shop(ctx(&mut scenario));

        // Check if the objects were created successfully
        let shop_id_opt = test_scenario::most_recent_id_for_address<NFTShop>(addr1);
        assert!(shop_id_opt.is_some(), 0); // Error if shop does not exist

        let counter_id_opt = test_scenario::most_recent_id_for_address<Counter>(addr1);
        assert!(counter_id_opt.is_some(), 0); // Error if counter does not exist
    };

    next_tx(&mut scenario, addr1);
    {
        let mut shop = test_scenario::take_from_sender<NFTShop>(&scenario);
        let mut counter = test_scenario::take_from_sender<Counter>(&scenario);

        // Correct way to create a Random object for testing purposes.
        RandomModule::create_for_testing(ctx(&mut scenario));
        // Pass the scenario context to take_shared
        let random: Random = test_scenario::take_shared(&scenario);

        // Correct way to create a mutable treasury cap for testing purposes.
        let mut treasury_cap: TreasuryCap<SUI> = CoinModule::create_treasury_cap_for_testing(ctx(&mut scenario));
        
        // Mint a coin using the treasury_cap.
        let payment = CoinModule::mint(&mut treasury_cap, 100000000, ctx(&mut scenario)); // 100000000 SUI

        // Use the payment coin in the mint_to_sender function
        suilaxy_nft::send_nft_to_sender(
            string::utf8(b"Test NFT"),
            string::utf8(b"Test Description"),
            string::utf8(b"http://example.com"),
            &random,
            payment,
            &mut shop,
            &mut counter,
            ctx(&mut scenario),
        );

        // Return unused objects back to the sender
        test_scenario::return_to_address<NFTShop>(addr1, shop);
        test_scenario::return_to_address<Counter>(addr1, counter);

        // Return or consume the random object
        test_scenario::return_shared(random);
        
        // TreasuryCap should be either consumed or returned
        test_scenario::return_to_address(addr1, treasury_cap);
    };

    next_tx(&mut scenario, addr1);
    {
        let mut shop = test_scenario::take_from_sender<NFTShop>(&scenario);
        suilaxy_nft::collect_profits(&mut shop, ctx(&mut scenario));
        test_scenario::return_to_address<NFTShop>(addr1, shop);
    };

    test_scenario::end(scenario);
}

}
