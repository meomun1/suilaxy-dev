module subscribe::subscribe {

    // import
    use sui::table::{Self, Table};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::balance::Balance;

    // struct 
    public struct GlobalConfig has key, store{
        id: UID,
        admin: address,
        subscribe_id: u64,
        subscribe_store: Table<u64, Subscribe>,
    }

    public struct Subscribe has store {
        id: u64,
        sender: address,        
        recipient: address,     
        interval: u64,          
        rate_per_interval: u64, 
        start_time: u64,        
        stop_time: u64,         
        create_at: u64,         
        deposit_amount: u64,    
        withdrawn_amount: u64,  
        remaining_amount: u64,  
        last_withdraw_time: u64,
        closed: bool,           
        reverse: Coin<SUI>
    }


    // Event 
    public struct SubscribeCreateEvent has copy, drop {
        id: u64,
        sender: address,        
        recipient: address,     
        interval: u64,          
        rate_per_interval: u64, 
        start_time: u64,        
        stop_time: u64,         
        create_at: u64,         
    }


    // function
    fun init(ctx: &mut TxContext){
        let owner_address = tx_context::sender(ctx);

        transfer::public_share_object(GlobalConfig {
            id: object::new(ctx),
            admin: owner_address,
            subscribe_id: 1,
            subscribe_store: table::new<u64, Subscribe>(ctx),
        });
    }

    public entry fun subscribe(
        global: &mut GlobalConfig,
        clock: &Clock,
        recipient: address,
        deposit_coin: &mut Coin<SUI>,
        deposit_amount: u64,
        start_time: u64,
        stop_time: u64,
        interval: u64,
        ctx: &mut TxContext
    ) {
        let sender_address = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);
        assert!(stop_time >= start_time && stop_time >= current_time, 0);

        let subscribe_id = global.subscribe_id;
        global.subscribe_id = global.subscribe_id + 1;

        let duration = (stop_time - start_time) / interval;
        let rate_per_interval: u64 = deposit_amount * 1000 / duration;
        assert!(interval * duration + start_time == stop_time, 0);

            let subscribe = Subscribe {
                id: 1,
                sender: sender_address,
                recipient,
                interval,
                rate_per_interval,
                start_time,
                stop_time,
                last_withdraw_time: start_time,
                create_at: current_time,
                deposit_amount,
                withdrawn_amount: 0u64,
                remaining_amount: 0u64,
                closed: false,
                reverse: coin::zero<SUI>(ctx)
            };

            event::emit(SubscribeCreateEvent {
                id: 1,
                sender: sender_address,
                recipient,
                interval,
                rate_per_interval,
                start_time,
                stop_time,
                create_at: current_time,
            });
            
            subscribe.remaining_amount = deposit_amount;
            coin::join<SUI>(&mut subscribe.reverse, coin::split(deposit_coin, deposit_amount, ctx));

            table::add(&mut global.subscribe_store, subscribe_id, subscribe);
    }

    public fun withdraw(
        global: &mut GlobalConfig,
        clock: &Clock,
        withdraw_amount: u64,
        subscribe_id: u64,
        ctx: &mut TxContext,
    ){
        let receiver_address = tx_context::sender(ctx);
        // let current_time = clock.timestamp_ms();

        assert!(table::contains(&global.subscribe_store,subscribe_id),0);

        let subscribe = table::borrow_mut(&mut global.subscribe_store, subscribe_id);
        assert!(subscribe.recipient == receiver_address, 0);
        assert!(subscribe.remaining_amount > withdraw_amount, 0);

        let coin = coin::split(&mut subscribe.reverse, withdraw_amount, ctx);
        transfer::public_transfer(coin, receiver_address);
    }

    public fun extend(
        global: &mut GlobalConfig,
        clock: &Clock,
        subscribe_id: u64,
        ctx: &mut TxContext) {

    }
    

    public fun close(
        global: &mut GlobalConfig,
        clock: &Clock,
        subscribe_id: u64,
        ctx: &mut TxContext
    ): (Coin<SUI>, Coin<SUI>){
        let receiver_addr = tx_context::sender(ctx);
        let current_time = clock.timestamp_ms();

        let subscribe = table::borrow_mut(&mut global.subscribe_store, subscribe_id);
        assert!(current_time < subscribe.stop_time, 0);
        assert!(subscribe.sender == receiver_addr, 0);

        let return_coin = withdraw_(&mut subscribe, current_time, ctx);

    }
}
