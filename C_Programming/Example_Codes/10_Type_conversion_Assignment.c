#include<stdio.h>
int main(void){
    int  i1, i2;                                                                        //POINTS TO REMEMBER IN ASCII OVER HERE, FROM 65 ONWARDS CAPITAL
                                                                                            // ALPHABETS START...
                                                                                        //FOR EG, 65 IS A 66 IS B 67 IS C LIKE TILL Z...IN OUR CASE WE NEEDED H WHICH IS 72
    float f1, f2;
    char c1, c2;
    c1 = 'H';
    i1= 80.56; /* Float converted to int, only 80 assigned to i1*/
    f1 = 12.6;
    c2 = i1; /*Int converted to char*/
    i2 = f1;/*float converted to int*/
    /*c2 has the character with ASCII value 80, i2 is assigned value 12*/

    printf("c2 = %c, i2 = %d\n", c2, i2);
    f2 = i1; /*Int converted to float*/
    i2 = c1;/*Char converted to int*/
/* now i2 has the ASCII value of character 'H' which is 72*/
    printf("f2 = %.2f, i2 = %d\n", f2, i2);

    return 0;
}