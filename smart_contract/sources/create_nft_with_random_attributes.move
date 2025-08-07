module suilaxy_nft::create_nft_with_random_attributes {
    use sui::random::{Random, new_generator};
    use std::string::{Self, String};

    const TIER1_CHANCE: u8 = 10;
    const TIER2_CHANCE: u8 = 30;

    public struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        frame: String,
        url: String,
        buff_rate: u8,
        lifesteal: u8,
        health_generation: u8,
        speed: u8,
        max_health: u8,
        armor: u8,
        bullet_dmg: u8,
        fire_rate: u8,
        bullet_size: u8,
    }

    // Struct representing frame points for attribute generation
    public struct Frame {
        frame_grade: String,
        frame_point: u8,
    }


    public(package) fun create_nft_with_attributes_from_frame(
        name: String,
        description: String,
        random: &Random,
        ctx: &mut TxContext,
    ) : NFT {
        // Ensure that the UID is used directly
        let nft_frame = generate_random_frame(random, ctx);

        let url = b"https://bafybeiey6g5yfukazyysxhzlluuoobz2djp6qalpcqhqdami4mwuef7k5m.ipfs.w3s.link/".to_string();
        let type_image = b".png".to_string();
        url.append(nft_frame.frame_grade);
        url.append(type_image);


        // Generate the UID for the NFT
        let id = object::new(ctx);

        let mut nft = NFT {
            id: id,
            name: name,
            description: description,
            frame: nft_frame.frame_grade,
            url: url,
            buff_rate: 0,
            lifesteal: 0,
            health_generation: 0,
            speed: 0,
            max_health: 0,
            armor: 0,
            bullet_dmg: 0,
            fire_rate: 0,
            bullet_size: 0,
        };

        // Generate random attributes based on frame points
        let mut generator = new_generator(random, ctx);
        
        let mut i = 0;

        // Generate random attributes based on the frame point
        while (i < nft_frame.frame_point) {
            let random_value = generator.generate_u8_in_range(0, 100);

            if (random_value < TIER1_CHANCE) {
                nft.buff_rate = nft.buff_rate + 1;
            }
            else if (random_value < TIER2_CHANCE) {
                let sub_random_value = generator.generate_u8_in_range(0, 1);
                if (sub_random_value == 0) {
                    nft.lifesteal = nft.lifesteal + 1;
                } else {
                    nft.health_generation = nft.health_generation + 1;
                }
            }
            else {
                let sub_random_value = generator.generate_u8_in_range(0, 5);
                match (sub_random_value) {
                    0 => nft.speed = nft.speed + 1,
                    1 => nft.max_health = nft.max_health + 1,
                    2 => nft.armor = nft.armor + 1,
                    3 => nft.bullet_dmg = nft.bullet_dmg + 1,
                    4 => nft.fire_rate = nft.fire_rate + 1,
                    _ => nft.bullet_size = nft.bullet_size + 1,
                }
            };
            i = i + 1; // Increment the loop variable
        };

        // Consume the frame after generating the NFT
        destroy_frame(nft_frame);

        // Return the NFT object with the attributes
        nft
    }

    // Generate random frame_grade, map with the frame_point value
    // ignore warning unused variable frame_point and frame_grade

    fun generate_random_frame(random: &Random, ctx: &mut TxContext): Frame {
        let mut generator = new_generator(random, ctx);

        let random_value = generator.generate_u16_in_range(0, 1000);
        let frame_grade;
        let frame_point;

        if (random_value <= 5) {
            frame_grade = b"Legendary".to_string();
            frame_point = 9;
        } else if (random_value <= 15) {
            frame_grade = b"Challenger".to_string();
            frame_point = 8;
        }
        else if (random_value <= 30) {
            frame_grade = b"Grandmaster".to_string();
            frame_point = 7;
        }
        else if (random_value <= 40) {
            frame_grade = b"Master".to_string();
            frame_point = 6;
        }
        else if (random_value <= 100) {
            frame_grade = b"Diamond".to_string();
            frame_point = 5;
        }
        else if (random_value <= 200) {
            frame_grade = b"Emerald".to_string();
            frame_point = 4;
        }
        else if (random_value <= 300) {
            frame_grade = b"Gold".to_string();
            frame_point = 3;
        }
        else if (random_value <= 400) {
            frame_grade = b"Silver".to_string();
            frame_point = 2;
        }
        else {
            frame_grade = b"Bronze".to_string();
            frame_point = 1;
        };
        
        Frame {frame_grade,frame_point,}
    }

    // Getter functions for the fields of NFT struct
    public fun get_nft_uid(nft: &NFT): &UID {
        &nft.id
    }

    public fun get_name(nft: &NFT): String {
        nft.name
    }

    public fun get_description(nft: &NFT): String {
        nft.description
    }

    public fun get_frame(nft: &NFT): String {
        nft.frame
    }

    public fun get_url(nft: &NFT): String {
        nft.url
    }

    public fun get_buff_rate(nft: &NFT): u8 {
        nft.buff_rate
    }

    public fun get_lifesteal(nft: &NFT): u8 {
        nft.lifesteal
    }

    public fun get_health_generation(nft: &NFT): u8 {
        nft.health_generation
    }

    public fun get_speed(nft: &NFT): u8 {
        nft.speed
    }

    public fun get_max_health(nft: &NFT): u8 {
        nft.max_health
    }

    public fun get_armor(nft: &NFT): u8 {
        nft.armor
    }

    public fun get_bullet_dmg(nft: &NFT): u8 {
        nft.bullet_dmg
    }

    public fun get_fire_rate(nft: &NFT): u8 {
        nft.fire_rate
    }

    public fun get_bullet_size(nft: &NFT): u8 {
        nft.bullet_size
    }

    // Getter functions for the fields of Frame struct
    public fun get_frame_grade(frame: &Frame): String {
        frame.frame_grade
    }

    public fun get_frame_point(frame: &Frame): u8 {
        frame.frame_point
    }

    public fun destroy_frame(frame: Frame) {
    // Here you would "use" the frame to consume it.
    let Frame { frame_grade, frame_point } = frame;
    let _ = frame_grade; // To explicitly consume it.
    let _ = frame_point; // To explicitly consume it.
    }
}